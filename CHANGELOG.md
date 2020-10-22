### 1.0.2 - 2020-10-22

* Fix: circleci config to only let the bot release - **[@markowsiak](https://github.com/markowsiak)** [#3](https://github.com/Automattic/vip-search-replace/pull/3)
  - [`ab319c8`](https://github.com/Automattic/vip-search-replace/commit/ab319c863b0067cbd5da93f10e439a667c2d1e42) 🐛 **fix:** circleci config to only let the bot release
* add something extra to test the bot - **[@markowsiak](https://github.com/markowsiak)** [#4](https://github.com/Automattic/vip-search-replace/pull/4)
  - [`fa862fd`](https://github.com/Automattic/vip-search-replace/commit/fa862fda092142211d528193163f02d8d1907e0c) 🐛 **fix:** add something extra to test the bot
* make nlm release run when circle user isn't the bot - **[@markowsiak](https://github.com/markowsiak)** [#5](https://github.com/Automattic/vip-search-replace/pull/5)
  - [`819920d`](https://github.com/Automattic/vip-search-replace/commit/819920d69bdc569584fa80ec076596ecdd50983e) 🐛 **fix:** make nlm release run when circle user isn't the bot


### 1.0.1 - 2020-10-22

* remove unnecessary comment - **[@markowsiak](https://github.com/markowsiak)** [#2](https://github.com/Automattic/vip-search-replace/pull/2)
  - [`e2f7742`](https://github.com/Automattic/vip-search-replace/commit/e2f77427dcb67d08bea97ea8eb4bc8d1496fda24) 🐛 **fix:** remove unnecessary comment


### 1.0.0 - 2020-10-22

* download the go binary needed for the customer computer - **[@markowsiak](https://github.com/markowsiak)** [#1](https://github.com/Automattic/vip-search-replace/pull/1)
  - [`615f9a7`](https://github.com/Automattic/vip-search-replace/commit/615f9a71e475b7037ca98a211fb9965b9c08542f) ♻️ **chore:** add LICENSE file
  - [`b5b4927`](https://github.com/Automattic/vip-search-replace/commit/b5b4927ee5a7c584bc722b50fa47dc3b483187ce) 🐛 **fix:** download the go binary needed for the customer computer
  - [`79b6e81`](https://github.com/Automattic/vip-search-replace/commit/79b6e81988fc2fb49ac30adb6428e1a9c4f0fbe2) ♻️ **chore:** add circleci config
  - [`0cbc08f`](https://github.com/Automattic/vip-search-replace/commit/0cbc08f5de160d6d0bedbd8476459fa5b26b6f22) 🐛 **fix:** removed unused var, remove unnecessary debug
  - [`91de5d3`](https://github.com/Automattic/vip-search-replace/commit/91de5d3e355df70c1bc96396272b2c3161ceb8c8) 🐛 **fix:** actulaly define test job
  - [`283acce`](https://github.com/Automattic/vip-search-replace/commit/283accee2f2cd9cf107e86c2f4e6a2d3a3ba078b) ✅ **test:** fix cicle config
  - [`40ec09c`](https://github.com/Automattic/vip-search-replace/commit/40ec09c6ec22ea658992f81be89c4c1aa405873e) ✅ **test:** add mock for spawn of child_process, fix tests
  - [`4510f2c`](https://github.com/Automattic/vip-search-replace/commit/4510f2c28cbcad629e7dbafddc8f5ff60431fc97) 🐛 **fix:** eslint warning, and stage index.js and install-go-binary.js
  - [`4488bc9`](https://github.com/Automattic/vip-search-replace/commit/4488bc98c7b22b1e50cbe5ef1ad544fdbbe89e4b) ♻️ **chore:** update circle config to release on master branch (pr merges) on last test cycle
  - [`0f2cd30`](https://github.com/Automattic/vip-search-replace/commit/0f2cd30a0bf02dc23f6d118a52e4da731dcba95a) 🐛 **fix:** bash for nlm release
  - [`57619cd`](https://github.com/Automattic/vip-search-replace/commit/57619cde56121187ea40de31dad73028647139c0) 🐛 **fix:** left an s in the circle config somehow 🤦‍♂️
  - [`5ed5f6d`](https://github.com/Automattic/vip-search-replace/commit/5ed5f6df62d87e07e36dd9e29500f32048956308) 🐛 **fix:** probably don't need to send an exit 1 on no release flow for circle ci
  - [`c2e305d`](https://github.com/Automattic/vip-search-replace/commit/c2e305db97a7e55d14de197447e0bde10eebf59b) ♻️ **chore:** upgrade nlm to support circleci
  - [`de9db8b`](https://github.com/Automattic/vip-search-replace/commit/de9db8bb27b567794cd845d6b30486ad26911bea) ✨ **feat:** get the latest binary version from github instead of pinning it.  Also add the binary to the global path where the library is installed.
  - [`96b1daf`](https://github.com/Automattic/vip-search-replace/commit/96b1daf2e0134d7fbf84e5d613179b5a66c85e77) ♻️ **chore:** ensure the binary is the same as after tests run in circle, or nlm will complain
  - [`69a32a1`](https://github.com/Automattic/vip-search-replace/commit/69a32a175e674ecd8eb181144fa35a19198d24a0) ✅ **test:** commit an empty binary and truncate it after test execution
  - [`f277129`](https://github.com/Automattic/vip-search-replace/commit/f2771298ee4c76ab5453388b28323057c53dfe9e) ✅ **test:** remove stub for spawned go process and actually test it
  - [`f57fa4c`](https://github.com/Automattic/vip-search-replace/commit/f57fa4c457fbe6640e5375bdefdec3bb18d29579) ✅ **test:** commmit sample sql input file
  - [`26bd1bf`](https://github.com/Automattic/vip-search-replace/commit/26bd1bfb563f836342c27351d18a45d97f3a5df1) ♻️ **chore:** try to debug why circle fails on the spawned process
  - [`b6eeaac`](https://github.com/Automattic/vip-search-replace/commit/b6eeaacaad149abc4922f0f2b8c6903b36fa3227) ♻️ **chore:** debug on npm t
  - [`374e1a5`](https://github.com/Automattic/vip-search-replace/commit/374e1a559186eae48535e32c805c7d179781cd28) ♻️ **chore:** circle didn't like that
  - [`6467212`](https://github.com/Automattic/vip-search-replace/commit/646721217095d6b5864e97890419f8c288e7583f) ✅ **test:** commit in a binary exclusively for testing in ci
  - [`51ec130`](https://github.com/Automattic/vip-search-replace/commit/51ec1304cab31e07388514b13002c38a6d078628) 🐛 **fix:** only download a binary if we don't supply one (in tests)
  - [`9209cb3`](https://github.com/Automattic/vip-search-replace/commit/9209cb39ea9408c1f1e9997b34a6a9563491f52a) 🐛 **fix:** envvars are always strings
  - [`dd1902b`](https://github.com/Automattic/vip-search-replace/commit/dd1902b7bac4ec347311c33baebdea4f9d44e1ef) 🐛 **fix:** Add ./bin/ to binary path
  - [`546566d`](https://github.com/Automattic/vip-search-replace/commit/546566d38a3922ffe3e8ec315ec3a331891f7a43) ♻️ **chore:** commit in license header for get-test-binary
  - [`b6853bc`](https://github.com/Automattic/vip-search-replace/commit/b6853bcc7c71695c0524ff14f2f416cf69550ee6) 🐛 **fix:** Add README example
  - [`9358635`](https://github.com/Automattic/vip-search-replace/commit/9358635b911f3e71727013bafbad5bd172d99f1d) 📝 **docs:** added some contributing and testing guidelines in the readme
* [`909f040`](https://github.com/Automattic/vip-search-replace/commit/909f04031ed9c7af2049290e9a076b09cea25b81) ✨ **feat:** add the initial offering form go-search-replace
