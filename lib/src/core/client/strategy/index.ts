import DefaultStrategy from './default-strategy';
import ApplicationHostnameStrategy from './application-hostname-strategy';
import GradualRolloutRandomStrategy from './gradual-rollout-random';
import GradualRolloutUserIdStrategy from './gradual-rollout-user-id';
import GradualRolloutSessionIdStrategy from './gradual-rollout-session-id';
import UserWithIdStrategy from './user-with-id-strategy';
import RemoteAddressStrategy from './remote-addresss-strategy';
import FlexibleRolloutStrategy from './flexible-rollout-strategy';
import { Strategy } from './strategy';

export { Strategy } from './strategy';
export { type StrategyTransportInterface } from './strategy';

export const defaultStrategies: Array<Strategy> = [
  new DefaultStrategy(),
  new ApplicationHostnameStrategy(),
  new GradualRolloutRandomStrategy(),
  new GradualRolloutUserIdStrategy(),
  new GradualRolloutSessionIdStrategy(),
  new UserWithIdStrategy(),
  new RemoteAddressStrategy(),
  new FlexibleRolloutStrategy(),
];
