#!/bin/bash

echo "start"

lowercaseTemplate="template"
uppercaseTemplate="Template"
lowercaseFilename=$1
uppercaseFilename=${lowercaseFilename^}
type=$2

copy="./src/utils/${uppercaseTemplate}.tsx"
target="./src/$type/$uppercaseFilename.tsx"

cp ${copy} ${target}

sed -i "s/$uppercaseTemplate/$uppercaseFilename/g" ${target}
