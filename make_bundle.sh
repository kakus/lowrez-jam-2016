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
rsync -av --progress bin/ bundle \
   --exclude local* \
   --exclude lib \
   --exclude .DS_Store

echo -- Minifying app.js
java -jar compiler.jar \
   --compilation_level ADVANCED\
   --language_out ECMASCRIPT5\
   --js_output_file $OUTDIR/app.min.js\
   bin/lib/promise.js\
   bin/lib/jsfxr.js\
   $OUTDIR/app.js

echo -- Updating index.html so its load minified app
sed -i "" s/app\.js/app.min.js/ $OUTDIR/index.html
echo -- Removing reference to jsfxr from index.html
sed -i "" /jsfxr/d $OUTDIR/index.html
echo -- Removing reference to promis.js from index.html
sed -i "" /promise\.js/d $OUTDIR/index.html

echo -- Zipping
zip -r -9 -x $OUTDIR/app.js -o $OUTDIR $OUTDIR

echo -- Bundle Size in bytes 
ls -l "$OUTDIR.zip" | awk '{print $5}'

echo -- DONE
