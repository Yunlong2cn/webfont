(function(r){
	"use strict";

	var gulp = r('gulp'),
		sass = r('gulp-ruby-sass'),
		iconfont = r('gulp-iconfont'),
		lineReader = r('line-reader'),
		fs = r('fs');

	gulp.task('sass', function() {
		gulp.src('dist/fonts/*')
			.pipe(gulp.dest('demo/fonts'));
		sass('demo/scss/app.scss')
			.pipe(gulp.dest('demo/css'));
	});


	gulp.task('iconfont', function() {
		var src = ['src/svg/*.svg'];
		gulp.src(src)
			.pipe(iconfont({
				fontName: 'webfont',
				appendUnicode: false,
				formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
				timestamp: Math.round(Date.now()/1000)
			}))
			.on('glyphs', function(glyphs, options) {
				var _variables = '';
				glyphs.map(function(glyph){
					_variables += glyph.name + ': "\\' + glyph.unicode[0].codePointAt(0).toString(16).toUpperCase() + '",';
				});
				var content = [];
				var _variables_path = 'src/scss/_variables.scss';
				lineReader.eachLine(_variables_path, function(line, last) {
					console.log(line, last);
					if(/\$wf\-icons*/.test(line)) {
						content.push(line.replace(line, '$wf-icons: ('+ _variables.substr(0, _variables.length-1) +');'));
					} else {
						content.push(line);
					}
					if(last) {
						console.log(content);
						fs.writeFile(_variables_path, content.join('\n'), function (err) {
							if (err) {
								console.log(err);
							} else {
								console.log('It\'s saved!');
							}
						});
					}
				});			
			})
			.pipe(gulp.dest('dist/fonts'));
	});

})(require);