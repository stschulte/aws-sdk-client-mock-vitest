#!/bin/bash
#
# Author: Stefan Schulte <stschulte@posteo.de>
#
# Small script to freshly start over installing all
# dependencies.
#
# Can be used to upgrade all dependencies, so be
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
    "@stylistic/eslint-plugin"
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
rm -rf node_modules
rm -rf package-lock.json
rm -rf *.tgz coverage dist
rm -rf dist

echo "Replacing package.json without dependencies"
NEW_PACKAGE_JSON=`mktemp package.json.XXXXXXXXXX`
chmod 0644 "$NEW_PACKAGE_JSON"
jq 'del(.dependencies, .devDependencies)' package.json > "$NEW_PACKAGE_JSON"
mv "$NEW_PACKAGE_JSON" package.json


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

echo ""
echo "We reinstalled all dependencies. You may want to run"
echo ""
echo "    git diff package.json"
echo ""
echo "now"
