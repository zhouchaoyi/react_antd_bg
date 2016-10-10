/**
 * Created by Liya on 2016/5/19.
 */
import React from 'react';

var Ueditor = React.createClass({
    componentDidMount(){
        var editor = UE.getEditor(this.props.id, {
            //工具栏
            lang:"zh-cn"
            //字体
            ,'fontfamily':[
                { label:'',name:'songti',val:'宋体,SimSun'},
                { label:'',name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
                { label:'',name:'yahei',val:'微软雅黑,Microsoft YaHei'},
                { label:'',name:'heiti',val:'黑体, SimHei'},
                { label:'',name:'lishu',val:'隶书, SimLi'},
                { label:'',name:'andaleMono',val:'andale mono'},
                { label:'',name:'arial',val:'arial, helvetica,sans-serif'},
                { label:'',name:'arialBlack',val:'arial black,avant garde'},
                { label:'',name:'comicSansMs',val:'comic sans ms'},
                { label:'',name:'impact',val:'impact,chicago'},
                { label:'',name:'timesNewRoman',val:'times new roman'}
            ]
            //字号
            ,'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]
            , enableAutoSave : false
            , autoHeightEnabled : false
            , initialFrameHeight: this.props.height
            , initialFrameWidth: '100%'
            ,readonly:this.props.disabled
        });
        var me = this;
        editor.ready( function( ueditor ) {
            var value = me.props.value?me.props.value:'<p></p>';
            editor.setContent(value);
        });
    },
    render : function(){
        return (
            <script id={this.props.id} name="content" type="text/plain">

            </script>
        )
    }
})
export default Ueditor;