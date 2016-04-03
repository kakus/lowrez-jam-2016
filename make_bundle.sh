#! /bin/bash

OUTDIR="bundle"

if [ -d "$OUTDIR" ]; then
   echo -- Removing directory $OUTDIR
   rm -rv $OUTDIR
fi

if [ -f "$OUTDIR.zip" ]; then
   echo -- Removing zipped $OUTDIR.zip
   rm -v "$OUTDIR.zip"
fi

echo -- Coping files from bin to $OUTDIR 
mkdir bundle
cp -rv bin/index.html bin/app.js bundle

echo -- Minifying app.js
java -jar compiler.jar \
   --compilation_level ADVANCED\
   --language_out ECMASCRIPT5\
   --js_output_file $OUTDIR/app.min.js\
   lib/jsfxr.js\
   $OUTDIR/app.js

echo -- Updating index.html so its load minified app
sed -i "" s/app\.js/app.min.js/ $OUTDIR/index.html
echo -- Removing reference to jsfxr from index.html
sed -i "" /jsfxr/d $OUTDIR/index.html

echo -- Zipping
zip -r -9 -x $OUTDIR/app.js -o $OUTDIR $OUTDIR

echo -- Bundle Size in bytes 
ls -l "$OUTDIR.zip" | awk '{print $5}'

echo -- DONE
