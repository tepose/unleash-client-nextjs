import type { Context, Variant } from "unleash-client/lib";
import type { FeatureInterface } from "unleash-client/lib/feature";
import type { VariantDefinition } from "unleash-client/lib/variant";
import { resolveContextValue } from "./client/helpers";
import normalizedValue from "./hash";

type Override = {
  contextName: string;
  values: string[];
};

const VARIANT_HASH_SEED = 86028157;

export function getDefaultVariant(): Variant {
  return {
    name: "disabled",
    enabled: false,
    feature_enabled: false,
  };
}

function randomString() {
  return String(Math.round(Math.random() * 100000));
}

const stickinessSelectors = ["userId", "sessionId", "remoteAddress"];

function getSeed(context: Context, stickiness: string = "default"): string {
  if (stickiness !== "default") {
    const value = resolveContextValue(context, stickiness);
    return value ? value.toString() : randomString();
  }
  let result;
  stickinessSelectors.some((key: string): boolean => {
    const value = context[key];
    if (typeof value === "string" && value !== "") {
      result = value;
      return true;
    }
    return false;
  });
  return result || randomString();
}

function overrideMatchesContext(context: Context): (o: Override) => boolean {
  return (o: Override) =>
    o.values.some(
      (value) => value === resolveContextValue(context, o.contextName)
    );
}

function findOverride(
  variants: VariantDefinition[],
  context: Context
): VariantDefinition | undefined {
  return variants
    .filter((variant) => variant.overrides)
    .find(
      (variant) => variant.overrides?.some(overrideMatchesContext(context))
    );
}

export function selectVariantDefinition(
  groupId: string,
  variants: VariantDefinition[],
  context: Context
): VariantDefinition | null {
  const totalWeight = variants.reduce((acc, v) => acc + v.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }
  const variantOverride = findOverride(variants, context);
  if (variantOverride) {
    return variantOverride;
  }

  const { stickiness } = variants[0];

  const target = normalizedValue(
    getSeed(context, stickiness),
    groupId,
    totalWeight,
    VARIANT_HASH_SEED
  );

  let counter = 0;
  const variant = variants.find(
    (v: VariantDefinition): VariantDefinition | undefined => {
      if (v.weight === 0) {
        return undefined;
      }
      counter += v.weight;
      if (counter < target) {
        return undefined;
      }
      return v;
    }
  );
  return variant || null;
}

export function selectVariant(
  feature: FeatureInterface,
  context: Context
): VariantDefinition | null {
  return selectVariantDefinition(feature.name, feature.variants, context);
}
