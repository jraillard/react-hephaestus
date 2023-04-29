import { Type } from '@sinclair/typebox';
import {
	ComponentFilesExtension,
	HookFileExtension,
	IndexFileExtension,
	QuoteMode,
	TypesFileExtension,
} from './enums';

/**
 * React Hephaestus configuration schema
 */
export const ConfigurationSchema = Type.Object({
	global: Type.Object({
		quotes: Type.Enum(QuoteMode),
	}),
	files: Type.Object({
		extension: Type.Object({
			index: Type.Enum(IndexFileExtension),
			hook: Type.Enum(HookFileExtension),
			types: Type.Enum(TypesFileExtension),
		}),
		rewrite: Type.Boolean(),
	}),
	components: Type.Object({
		useHooks: Type.Boolean(),
		extension: Type.Enum(ComponentFilesExtension),
	}),
});
