/**
 * Created by Liya on 2016/5/30.
 */
var path = require("path");
var log4js = require("log4js");




exports.configure = function() {
    log4js.configure({
        appenders: [

            {
                //type: 'file', //文件输出
                "type": "dateFile", // 每日输出
                "filename": "logs/logfile.log",
                "pattern": "-yyyy-MM-dd",
                category: 'fileLog' // 如果使用 fileLog 这个appender的话，则记录到文件中
            }
        ]
    });

}

exports.getLogger = function(name) {
    var x = log4js.getLogger(name);
    x.setLevel(log4js.levels.INFO);
    return x;
}

exports.forUse = function() {
    this.configure();
    return log4js.connectLogger(
        log4js.getLogger("fileLog"),
        {level: log4js.levels.INFO,format:':method :url'}
    );
}
