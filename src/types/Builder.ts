import { BuilderCB as BrynjaBuilder } from 'brynja/dist/builder';
import { DynamicsCache } from './DynamicCache';

export type Builder = (cache: DynamicsCache) => BrynjaBuilder;
