### 1.0.17 - 2021-09-22

* [`3ef72aa`](https://github.com/Automattic/vip-search-replace/commit/3ef72aaac9e1d30803dc3c9abebaafd77a461055) 👷 **build:** bump tmpl from 1.0.4 to 1.0.5 (#30) - see: [#30](https://github.com/Automattic/vip-search-replace/issues/30)


### 1.0.16 - 2021-02-26

* build: Add allowed list of os & cpu - **[@jblz](https://github.com/jblz)** [#19](https://github.com/Automattic/vip-search-replace/pull/19)
  - [`f259189`](https://github.com/Automattic/vip-search-replace/commit/f25918997bd2917406bf39fd4a65feb786d192f9) 👷 **build:** Add allowed list of os & cpu
  - [`c52c81f`](https://github.com/Automattic/vip-search-replace/commit/c52c81f1a500dd3c1c6533bb81d244fb3c17ce53) 👷 **build:** rm freebsd from os map & update test


### 1.0.15 - 2021-02-24

* fix: Correctly reference the arm64 arch - **[@jblz](https://github.com/jblz)** [#18](https://github.com/Automattic/vip-search-replace/pull/18)
  - [`8449310`](https://github.com/Automattic/vip-search-replace/commit/8449310a03688b7655e4fb3f81d889d1ba49dc58) 🐛 **fix:** Correctly reference the arm64 arch


### 1.0.14 - 2021-02-24

* fix: Correct GOARCH. arm64, not arm - **[@jblz](https://github.com/jblz)** [#17](https://github.com/Automattic/vip-search-replace/pull/17)
  - [`a4a5aba`](https://github.com/Automattic/vip-search-replace/commit/a4a5aba110c2ab115b3649ce1fe52247498e4a3a) 🐛 **fix:** Correct GOARCH. arm64, not arm


### 1.0.13 - 2021-02-12

* fix: Explicitly close file descriptor after install - **[@jblz](https://github.com/jblz)** [#16](https://github.com/Automattic/vip-search-replace/pull/16)
  - [`2151f1c`](https://github.com/Automattic/vip-search-replace/commit/2151f1c63224ae1a47e63a3e67ced86a8bbe0b92) 🐛 **fix:** Explicitly close file descriptor after install


### 1.0.12 - 2021-02-11

* Fall back to a temp dir when unable to access package dir - **[@jblz](https://github.com/jblz)** [#15](https://github.com/Automattic/vip-search-replace/pull/15)
  - [`faf3502`](https://github.com/Automattic/vip-search-replace/commit/faf35020ea94f7f21883f60c69855b5880e4f113) 🐛 **fix:** Fall back to a temp dir when unable to access package dir
  - [`dcc181f`](https://github.com/Automattic/vip-search-replace/commit/dcc181fef3fff3c9eb9fe4ad7ad31b2465297b70) ✅ **test:** Cover getInstallDir & unwritable file in installBinary


### 1.0.11 - 2021-02-08

* Refactor install lib and script -- download binary to package dir - **[@jblz](https://github.com/jblz)** [#14](https://github.com/Automattic/vip-search-replace/pull/14)
  - [`70968d7`](https://github.com/Automattic/vip-search-replace/commit/70968d7d5c977165e6f4c2884745ddeeb37839cc) 📝 **docs:** update copyright date
  - [`ef8481f`](https://github.com/Automattic/vip-search-replace/commit/ef8481ff10317f93eebfda8ab9f815e0cd7ff898) 👷 **build:** mv download script to bin; hashbang; 755
  - [`b5a4676`](https://github.com/Automattic/vip-search-replace/commit/b5a467635605ab25b48eb686800228822dc23073) 👷 **build:** remove empty binary and add path to gitignore
  - [`bb8e4b1`](https://github.com/Automattic/vip-search-replace/commit/bb8e4b1acd752d1d1372f5db90819cbdeab41b4c) ✅ **test:** don't truncate bin after tests
  - [`510d7a1`](https://github.com/Automattic/vip-search-replace/commit/510d7a1222278e4bf3fc3ec3704e83d8a6aae822) 📦️ **refactor:** split out functions, return format, gz instance per call, etc.
  - [`44ebab3`](https://github.com/Automattic/vip-search-replace/commit/44ebab3e800bc6e29c5fb38b495921dc98d06a42) 📦️ **refactor:** install script: support passed args; handle errors; show usage examples
  - [`b37a103`](https://github.com/Automattic/vip-search-replace/commit/b37a10354ca9f58017f6bfbe653025c9729c7581) 👷 **build:** package scripts: generally useful, download-binary; download-test-binary calls it
  - [`9213e15`](https://github.com/Automattic/vip-search-replace/commit/9213e15bd69fdb1ad07e4d33f1007337e97f1342) 👷 **build:** Include bin in nlm license files
  - [`fcfb973`](https://github.com/Automattic/vip-search-replace/commit/fcfb9731ed9cbfae04ea11a4b821d1032476ae1c) ✅ **test:** coverage++; nock download URL; jest --silent, no more
  - [`f29d7cb`](https://github.com/Automattic/vip-search-replace/commit/f29d7cbc9411426ca11da0e59d44fb8b4dec966c) 🐛 **fix:** Include .exe suffix in windows bin file


### 1.0.10 - 2021-02-01

* fix: Don't block at all, just return output stream - **[@jblz](https://github.com/jblz)** [#13](https://github.com/Automattic/vip-search-replace/pull/13)
  - [`05a0a71`](https://github.com/Automattic/vip-search-replace/commit/05a0a7161b82eba3bba43b1b48b34298393f87b1) 🐛 **fix:** Don't block at all, just return output stream
  - [`81902c1`](https://github.com/Automattic/vip-search-replace/commit/81902c1e79895d5899e460ea7d56734da88513e1) 🐛 **fix:** return a passthrough instead of child's stdout & resolve on data


### 1.0.9 - 2021-02-01

* [`a9124e5`](https://github.com/Automattic/vip-search-replace/commit/a9124e505512bf4dfd194cc2748cd1a856bb899f) 🐛 **fix:** Attach stream listeners prior to starting flow


### 1.0.8 - 2021-02-01

* fix: hanging output stream - **[@markowsiak](https://github.com/markowsiak)** [#11](https://github.com/Automattic/vip-search-replace/pull/11)
  - [`93196f5`](https://github.com/Automattic/vip-search-replace/commit/93196f501b76e193c3488cb43a5c486ae037bdac) 🐛 **fix:** hanging output stream
  - [`020ac61`](https://github.com/Automattic/vip-search-replace/commit/020ac618b2675ef23137cc865a8f3a38d5f2b744) 🐛 **fix:** block until stream closes
  - [`88026e7`](https://github.com/Automattic/vip-search-replace/commit/88026e742230cc31b0d575292aa9413306eb5916) 🐛 **fix:** listen for the exit event on child_process instead of close, emits after child process ends


### 1.0.7 - 2021-01-29

* Listen for a non-zero exit code from the go-search-replace process - **[@markowsiak](https://github.com/markowsiak)** [#10](https://github.com/Automattic/vip-search-replace/pull/10)
  - [`75a74eb`](https://github.com/Automattic/vip-search-replace/commit/75a74eb7d943ea5eee706c1183fc266cf35f9fec) 🐛 **fix:** Listen for a non-zero exit code from the go-search-replace process
  - [`ff7eca5`](https://github.com/Automattic/vip-search-replace/commit/ff7eca572b3a2b35c063c48a5ca24422866dc94e) ✅ **test:** Test for non-zero exit codes
  - [`f61bcc9`](https://github.com/Automattic/vip-search-replace/commit/f61bcc93f9377fc10082047ce393a0bfc7bf0002) 🐛 **fix:** Test cleanup and troubleshooting
  - [`bc49a9b`](https://github.com/Automattic/vip-search-replace/commit/bc49a9bdfc1039efe31f84aec14fd3e2c6927fc6) 🐛 **fix:** More debugging of go library exit code and exceptions in async functions
  - [`acc002e`](https://github.com/Automattic/vip-search-replace/commit/acc002edcc6784a32e9aa4657c681a0749e543ff) 🐛 **fix:** Have replace return a Promise, and use rejections
  - [`02325ac`](https://github.com/Automattic/vip-search-replace/commit/02325ac1cf65a7e6ee61a6f78846e67d2ffbafec) ✅ **test:** write to a tmpdir


### 1.0.6 - 2020-12-08

* fix: get-test-binary script bad variable - **[@jblz](https://github.com/jblz)** [#9](https://github.com/Automattic/vip-search-replace/pull/9)
  - [`ed54ca0`](https://github.com/Automattic/vip-search-replace/commit/ed54ca0954c6d50076169fee6edb2ccde1e5fd4b) 🐛 **fix:** get-test-binary script bad var


### 1.0.5 - 2020-12-01

* perf: Download using the 'latest release' redirect URL - **[@jblz](https://github.com/jblz)** [#8](https://github.com/Automattic/vip-search-replace/pull/8)
  - [`b8b3146`](https://github.com/Automattic/vip-search-replace/commit/b8b314619004dbe1d9bd4da3ba1d3450292e9267) ⚡ **perf:** Download using the 'latest release' redirect URL


### 1.0.4 - 2020-12-01

* fix: Incorrect path is used for downloaded binary - **[@jblz](https://github.com/jblz)** [#7](https://github.com/Automattic/vip-search-replace/pull/7)
  - [`cd3232d`](https://github.com/Automattic/vip-search-replace/commit/cd3232d35c8de76bd067a052efe3904d6a3522d7) 🐛 **fix:** Incorrect path is used for downloaded binary


### 1.0.3 - 2020-11-10

* return the original stream if no replacements are passed - **[@markowsiak](https://github.com/markowsiak)** [#6](https://github.com/Automattic/vip-search-replace/pull/6)
  - [`70b5cb9`](https://github.com/Automattic/vip-search-replace/commit/70b5cb98bc5c5aa41d72d67f8ce18fbf1bb34f85) 🐛 **fix:** return the original stream if no replacements are passed
  - [`c0a9b9b`](https://github.com/Automattic/vip-search-replace/commit/c0a9b9b6199a26de6dc350b6f561839464774586) ♻️ **chore:** name the circleci jobs
  - [`0f1ddea`](https://github.com/Automattic/vip-search-replace/commit/0f1ddea4926176059449ed35a4176f95ba65643c) ✅ **test:** use path.join instead of dirname, attempting to fix current-stretch issue
  - [`1123cbb`](https://github.com/Automattic/vip-search-replace/commit/1123cbbe4c4a30bce3ba3dcfc6421bb0b782ef40) 🐛 **fix:** release on lts-stretch and check for outfile before deleting
  - [`2f98495`](https://github.com/Automattic/vip-search-replace/commit/2f984955bd53b84b8cf81a234275d4bf3ddf68ec) 🐛 **fix:** address PR comments for using debug and having more complete tests


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
