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
#  --compilation_level ADVANCED\
java -jar compiler.jar \
   --compilation_level SIMPLE_OPTIMIZATIONS\
   --language_out ECMASCRIPT5\
   --js_output_file $OUTDIR/app.min.js\
   bin/lib/promise.js\
   bin/lib/howler.js\
   $OUTDIR/app.js
   


#echo -- Adding promies
#cat bin/lib/promise.js > $OUTDIR/tmp
#echo -- Adding howler
#cat bin/lib/howler.js >> $OUTDIR/tmp
#echo -- Merging with app.min.js
#cat $OUTDIR/app.min.js >> $OUTDIR/tmp
#mv $OUTDIR/tmp $OUTDIR/app.min.js

echo -- Updating index.html so its load minified app
sed -i "" s/app\.js/app.min.js/ $OUTDIR/index.html
echo -- Removing reference to howler from index.html
sed -i "" /howler/d $OUTDIR/index.html
echo -- Removing reference to promis.js from index.html
sed -i "" /promise\.js/d $OUTDIR/index.html

echo -- Removing app.js
rm $OUTDIR/app.js

echo -- Zipping
zip -r -9 -x $OUTDIR/app.js -o $OUTDIR $OUTDIR

echo -- Bundle Size in bytes 
ls -l "$OUTDIR.zip" | awk '{print $5}'

echo -- DONE
