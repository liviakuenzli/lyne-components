import config, * as stories from './sbb-time-input.stories';
import { chromaticStoryConfig, combineStories } from '../../global/helpers/chromatic';

export const chromaticStories = combineStories(config, stories);

export default chromaticStoryConfig(config);
