/// <reference types="node" />
import stream = require('stream');

/**
 * The Search and Replace Process
 *
 * @param {stream.Readable} streamObj The readable stream
 * @param {string[]} replacements An array of replacements
 * @param {string|null|undefined} binary An optional binary can be passed in for testing
 * @return {Promise<stream.Readable>} streamObj
 */
export function replace(streamObj: stream.Readable, replacements: string[], binary?: string | null): Promise<stream.Readable>;

/**
 * Validate the library inputs
 *
 * @param {*} streamObj The readable stream
 * @param {*} replacements An array of replacements
 * @return {Boolean} valid
 */
export function validate(streamObj: unknown, replacements: unknown): boolean;
