import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

function config(file = 'kundera.conf.yml') {
    return parse(readFileSync('kundera.conf.yml').toString());
}

export default config;
