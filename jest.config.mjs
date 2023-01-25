const config = {
    setupFilesAfterEnv: ['./jest-setup.ts'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$':
            '<rootDir>/node_modules/jest-css-modules',
    },
    testEnvironment: 'jsdom',
}

export default config
