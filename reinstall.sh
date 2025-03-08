#!/bin/bash
#
# Author: Stefan Schulte <stschulte@posteo.de>
#
# Small script to freshly start over installing all
# dependencies.
#
# Script can be used to upgrade all dependencies to
# to the latest version by simply having npm figure out
# the dependency tree again.
#
# Be careful as this will also upgrade over major versions

set -e

RUNTIME_DEPENDENCIES=(
  "@vitest/expect"
)

BUILDTIME_DEPENDENCIES=(
    "typescript"
    "@types/node"

    "@aws-sdk/client-s3"
    "@aws-sdk/client-secrets-manager"
    "aws-sdk-client-mock"

    "eslint"
    "@eslint/js"
    "eslint-config-flat-gitignore"
    "eslint-plugin-perfectionist"
    "@stylistic/eslint-plugin"
    "typescript-eslint"
    "@vitest/eslint-plugin"

    "vitest"
    "@vitest/coverage-v8"
)

if [[ ! -f package.json ]]; then
  echo "No package.json found. Are you executing the script in the right directory? Abort now" 1>&2
  exit 3
fi

echo "Cleanup"
rm -rf node_modules package-lock.json *.tgz coverage dist

NEW_PACKAGE_JSON=`mktemp package.json.XXXXXXXXXX`
chmod 0644 "$NEW_PACKAGE_JSON"
jq 'del(.dependencies, .devDependencies)' package.json > "$NEW_PACKAGE_JSON"
mv "$NEW_PACKAGE_JSON" package.json

echo ">> Installing dependencies"
for PKG in "${RUNTIME_DEPENDENCIES[@]}"; do
  echo " ● ${PKG}"
done
npm install "${RUNTIME_DEPENDENCIES[@]}"

echo ">> Installing development dependencies"
for PKG in "${BUILDTIME_DEPENDENCIES[@]}"; do
  echo " ● ${PKG}"
done
npm install --save-dev "${BUILDTIME_DEPENDENCIES[@]}"

echo ">> DONE"

echo ""
echo "We reinstalled all dependencies. You may want to run"
echo ""
echo "    git diff package.json"
echo ""
echo "now"
