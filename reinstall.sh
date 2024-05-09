#!/bin/bash
#
# Author: Stefan Schulte <stschulte@posteo.de>
#
# Small script to freshly start over installing all
# dependencies.
#
# Can you be used to upgrade all dependencies, so be
# carefull executing this.
set -e

DEPS=(
  "@vitest/expect"
  "tslib"
)
DDEPS=(
    "typescript"
    "aws-sdk-client-mock"
    "@aws-sdk/client-ec2"
    "@aws-sdk/client-s3"
    "@smithy/types"
    "eslint"
    "@eslint/js"
    "eslint-config-flat-gitignore"
    "eslint-plugin-perfectionist"
    "typescript-eslint"
    "vitest"
    "@vitest/coverage-v8"
    "@types/node"
)

if [[ ! -f package.json ]]; then
  echo "No package.json found. Are you executing the script in the right directory? Abort now" 1>&2
  exit 3
fi

echo "Cleanup"
rm -rf node_modules package-lock.json aws-sdk-client-mock-vitest-*.tgz coverage dist-cjs dist-es dist-types
sed -i \
  -e '/^  "dependencies"/,/^  \}/D' \
  -e '/^  "devDependencies"/,/^  \}/D' \
  -e 's/^\(  "homepage".*\),$/\1/' \
  package.json


echo ">> Installing dependencies"
for PKG in "${DEPS[@]}"; do
  echo " * ${PKG}"
done
npm install "${DEPS[@]}"

echo ">> Installing development dependencies"
for PKG in "${DDEPS[@]}"; do
  echo " * ${PKG}"
done
npm install --save-dev "${DDEPS[@]}"

echo ">> DONE"
