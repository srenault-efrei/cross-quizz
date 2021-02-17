module.exports = (api) => {
  api.cache(true)

  const presets = ['@babel/preset-env', '@babel/preset-typescript']

  const plugins = [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/transform-runtime',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ]

  return { presets, plugins }
}
