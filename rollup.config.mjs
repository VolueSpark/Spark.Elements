import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss-modules'
import copy from 'rollup-plugin-copy'
import { createRequire } from 'module'
import autoprefixer from 'autoprefixer'
import postcssUrl from 'postcss-url'
import dts from 'rollup-plugin-dts'

const require = createRequire(import.meta.url)
const packageJson = require('./package.json')

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve({
                browser: true,
            }),
            commonjs(),
            typescript({ useTsconfigDeclarationDir: true }),
            postcss({
                extract: true,
                plugins: [autoprefixer(), postcssUrl({ url: 'inline' })],
                writeDefinitions: true,
                modules: true,
            }),
            copy({
                targets: [
                    {
                        src: 'src/index.css',
                        dest: 'build',
                        rename: 'index.css',
                    },
                ],
            }),
        ],
    },
    // TODO: more files than just index.d.ts are generated
    {
        input: './build/index.d.ts',
        output: [{ file: 'build/index.d.ts', format: 'es' }],
        plugins: [dts()],
    },
]
