.PHONY: build.%

install: node_modules

clean_install:
	rm -rf node_modules/

node_modules:
	npm install

build.darwin: install target/icons
	node_modules/.bin/electron-packager . 'Google Photos' --platform darwin --arch=x64 --overwrite --icon=target/icons/icon.icns --no-asar --ignore="docs/" --out=target

clean:
	rm -rf target/

target/icons:
	mkdir target/
	mkdir target/icons
	mkdir target/icons/icon.iconset
	sips -z 16 16     icon.png --out target/icons/icon.iconset/icon_16x16.png
	sips -z 32 32     icon.png --out target/icons/icon.iconset/icon_16x16@2x.png
	sips -z 32 32     icon.png --out target/icons/icon.iconset/icon_32x32.png
	sips -z 64 64     icon.png --out target/icons/icon.iconset/icon_32x32@2x.png
	sips -z 128 128   icon.png --out target/icons/icon.iconset/icon_128x128.png
	sips -z 256 256   icon.png --out target/icons/icon.iconset/icon_128x128@2x.png
	sips -z 256 256   icon.png --out target/icons/icon.iconset/icon_256x256.png
	sips -z 512 512   icon.png --out target/icons/icon.iconset/icon_256x256@2x.png
	sips -z 512 512   icon.png --out target/icons/icon.iconset/icon_512x512.png
	sips -z 1024 1024 icon.png --out target/icons/icon.iconset/icon_512x512@2x.png
	iconutil -c icns target/icons/icon.iconset
