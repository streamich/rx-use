# [1.8.0](https://github.com/streamich/rx-use/compare/v1.7.0...v1.8.0) (2022-04-22)


### Bug Fixes

* 🐛 allow re-sending duplicate mussages over localStorage ([ec7bcb3](https://github.com/streamich/rx-use/commit/ec7bcb39212e15ffe468c990f4bcbc0079b0110a))


### Features

* 🎸 add ability for tabs to establish call channels ([130ac0b](https://github.com/streamich/rx-use/commit/130ac0b06202070f68c4e6afbf72697bc3048bba))
* 🎸 add dependency injection to tablist ([c21aa92](https://github.com/streamich/rx-use/commit/c21aa926b7af38c7bd608a4664e69dd950661b88))
* 🎸 allow broadcast channels to be numbers ([e7432a6](https://github.com/streamich/rx-use/commit/e7432a61365ae00089a61b2f73f7172f41d467fc))
* 🎸 elect oldest tab a the leader ([5a62949](https://github.com/streamich/rx-use/commit/5a62949287cf8e05eed1c8b0b77e0d4015caeb29))
* 🎸 implement TabList ([04b9608](https://github.com/streamich/rx-use/commit/04b960830f136e275e024991dcf09124b2f6e646))
* 🎸 make in-memory pubsub busses global ([1edaf30](https://github.com/streamich/rx-use/commit/1edaf300623c529d34f185abd1e3f226c46b785e))
* 🎸 make pubsub channel name configurable ([55dbae1](https://github.com/streamich/rx-use/commit/55dbae19e9bbed3e147d88ed83b5bc430e7aa560))

# [1.7.0](https://github.com/streamich/rx-use/compare/v1.6.0...v1.7.0) (2022-04-20)


### Features

* 🎸 add el() helper ([e6fae4c](https://github.com/streamich/rx-use/commit/e6fae4c412e59c5ebc5c7b0b82cf9468fc13f2aa))
* 🎸 add PubSub implementation on top of BroadcastChannel ([561d542](https://github.com/streamich/rx-use/commit/561d54261952a6fd53c4b80e5475d4230988c0ab))
* 🎸 allow dynamic children in el() ([4ed8c5e](https://github.com/streamich/rx-use/commit/4ed8c5e999ac94b8e924a4709f22c51541df7d84))
* 🎸 improve pubsub implementation ([0df54f9](https://github.com/streamich/rx-use/commit/0df54f97866ef6b5e21dd8194c6c848de4ee8ff5))

# [1.6.0](https://github.com/streamich/rx-use/compare/v1.5.1...v1.6.0) (2020-07-19)


### Features

* 🎸 add STDIN and ANSI key sensors ([239ada3](https://github.com/streamich/rx-use/commit/239ada3c3dafe21168c38e49f4a524377669bd28))

## [1.5.1](https://github.com/streamich/rx-use/compare/v1.5.0...v1.5.1) (2020-06-03)


### Bug Fixes

* 🐛 correctly set initial value in matchMedia$ ([c173deb](https://github.com/streamich/rx-use/commit/c173debd68f011fb2d61f11ac93e146a5a0a70a2))

# [1.5.0](https://github.com/streamich/rx-use/compare/v1.4.0...v1.5.0) (2020-06-02)


### Bug Fixes

* 🐛 correctly emit darkTheme$ values ([c9a0166](https://github.com/streamich/rx-use/commit/c9a0166e304dc2b3bb5226a2c05df47843a08f45))
* 🐛 make match media observables behave like behavior subjec ([71a5d0c](https://github.com/streamich/rx-use/commit/71a5d0c0bad822409df4965507606e5819b6e28b))


### Features

* 🎸 export types ([b341dea](https://github.com/streamich/rx-use/commit/b341dea213050857b9e482b182f6e8e258ae4be3))

# [1.4.0](https://github.com/streamich/rx-use/compare/v1.3.0...v1.4.0) (2020-05-16)


### Features

* 🎸 add colorSchemeDark$ ([fd75060](https://github.com/streamich/rx-use/commit/fd7506014e1ba4d15317135ef0cce1ad726c759d))
* 🎸 add colorSchemeLight$ ([c6161db](https://github.com/streamich/rx-use/commit/c6161dbe2d5c75ecc12347b1db55788c453fe3fe))
* 🎸 add colorSchemeNoPreference$ ([b2cca5c](https://github.com/streamich/rx-use/commit/b2cca5c1dd2bd8aef8f63e06ce750d241f497c57))
* 🎸 add darkTheme$ ([a605077](https://github.com/streamich/rx-use/commit/a605077316f7e04974b4376b34682d64728fb6e9))
* 🎸 use ReadonlyBehaviorSubject as export type ([ddeaf01](https://github.com/streamich/rx-use/commit/ddeaf0127d61ca076edb40c5159d7d88cb1737dd))

# [1.3.0](https://github.com/streamich/rx-use/compare/v1.2.0...v1.3.0) (2020-05-16)


### Features

* 🎸 add matchMedia$ observable ([939898c](https://github.com/streamich/rx-use/commit/939898c6c5da3cef3675f89901491e37dbaa664b))
* 🎸 improve matchMedia$ observable ([021f1aa](https://github.com/streamich/rx-use/commit/021f1aa3a0c6e471a7966607a86439a306995524))

# [1.2.0](https://github.com/streamich/rx-use/compare/v1.1.0...v1.2.0) (2020-05-03)


### Features

* 🎸 add onLine$, connection$ and network$ observables ([b36ede5](https://github.com/streamich/rx-use/commit/b36ede5696b3badf740a61efc36c411065ef5822))

# [1.1.0](https://github.com/streamich/rx-use/compare/v1.0.0...v1.1.0) (2020-05-02)


### Features

* 🎸 add pathname$ observable ([08857ad](https://github.com/streamich/rx-use/commit/08857adff273bb5441a3ec47a60ca20d047fc8ba))

# 1.0.0 (2020-05-02)


### Features

* 🎸 add location$ observable ([ed69dd2](https://github.com/streamich/rx-use/commit/ed69dd23941c6df1a5b46860bca38ea243dfca29))
* 🎸 add raf() operator ([551aa7e](https://github.com/streamich/rx-use/commit/551aa7ee7391485621c79d7e5acca8bbba762832))
* 🎸 add windowSize$ observable ([c1d7bc1](https://github.com/streamich/rx-use/commit/c1d7bc176a89326073dfc0a8ec69862f06753a05))
* 🎸 add windowSizeRaf$ obsevable ([7f1ba89](https://github.com/streamich/rx-use/commit/7f1ba894ca461474c63481d09bb06f2b2b91bab4))
* 🎸 improve location$ implementation ([97591ec](https://github.com/streamich/rx-use/commit/97591ec61bed886c6076ff8b63e5283d91261dbe))
