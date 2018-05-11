/**
 * Created by Administrator on 2017/8/16.
 */

var leipiEditor = UE.getEditor('myFormDesign', {
    //allowDivTransToP: false,//阻止转换div 为p
    toolleipi: true//是否显示，设计器的 toolbars
    // ,textarea: 'design_content'
    //这里可以选择自己需要的工具按钮名称,此处仅选择如下
    , toolbars: [
        [
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'emotion', 'scrawl', 'insertvideo', 'map', 'insertframe', 'background', 'insertcode',
            'horizontal', 'date', 'time', 'spechars', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol','|', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'searchreplace', 'help', 'drafts'
        ]
    ]
    //focus时自动清空初始化时的内容
    //autoClearinitialContent:true
    , wordCount: false//是否开启字数统计
    , maximumWords: 100000//允许的最大字符数
    , elementPathEnabled: false//关闭elementPath
    , wordCountMsg: '当前已输入{#count}个字符, 您还可以输入{#leave}个字符。'
    , initialFrameHeight: 300 //默认的编辑区域高度
    , iframeCssUrl: "css/bootstrap.min.css" //引入自身 css使编辑器兼容你网站css
    //更多其他参数，请参考ueditor.config.js中的配置项
    , allHtmlEnabled: false //提交到后台的数据是否包含整个HTML字符串
    // ,listDefaultPaddingLeft:30//默认的左边缩进基数倍
    , initialFrameWidth: "100%"//默认宽
    // , webAppKey: "SiYGGoi1EwRl6iGih1dyXo9A208GHRZ1"
    // ,initialContent:tem,
    // ,serialize : {
    //     //黑名单，编辑器会过滤掉以下标签
    //     blackList:{style:1, link:1,object:1, input:1, meta:1,a:1},
    //     //白名单，编辑器会根据此配置保留对应标签下的对应标签或者属性
    //     whiteList:{
    //         'p': {'br':1,'BR':1},
    //         'br':{'$':{}},
    //         'div':{'br':1,'BR':1,'$':{'id':1,'style':1}}
    //     }
    // }
});

var leipiFormDesign = {
    /*执行控件*/
    exec: function (method) {
        leipiEditor.execCommand(method);
    },
    /*
     Javascript 解析表单
     template 表单设计器里的Html内容
     fields 字段总数
     */

    parse_form: function (template, fields) {
        //正则  radios|checkboxs|select 匹配的边界 |--|  因为当使用 {} 时js报错
        var preg = /(\|-<span(((?!<span).)*leipiplugins=\"(radios|checkboxs|select)\".*?)>(.*?)<\/span>-\||<(img|input|textarea|select).*?(<\/select>|<\/textarea>|\/>))/gi,
            preg_attr = /(\w+)=\"(.?|.+?)\"/gi, preg_group = /<input.*?\/>/gi;
        if (!fields) fields = 0;
        var template_parse = template, template_data = new Array(), add_fields = new Object(), checkboxs = 0;

        // var pno = 0;
        template.replace(preg, function (plugin, p1, p2, p3, p4, p5, p6) {
            // debugger;
            var parse_attr = new Array(), attr_arr_all = new Object(), name = '', select_dot = '', is_new = false;
            var p0 = plugin;
            var tag = p6 ? p6 : p4;//将P6（标签名）赋值给tag
            if (tag == 'radios' || tag == 'checkboxs') {
                plugin = p2;
            } else if (tag == 'select') {
                //用来清除“|-”“-|”
                plugin = plugin.replace('|-', '');
                plugin = plugin.replace('-|', '');
            }
            // console.log(plugin);
            plugin.replace(preg_attr, function (str0, attr, val) {
                if (attr == 'name') {
                    if (val == 'leipiNewField')//如果为name属性时，并且值为leipiNewField
                    {
                        is_new = true;
                        fields++;
                        val = 'data_' + fields;//重命名（此处可以设置默认名）
                    }
                    name = val;//name属性赋值
                }

                if (tag == 'select' && attr == 'value')//判断标签名和标签的属性名
                {
                    if (!attr_arr_all[attr]) attr_arr_all[attr] = '';
                    attr_arr_all[attr] += select_dot + val;
                    select_dot = ',';
                } else {
                    attr_arr_all[attr] = val;
                }
                var oField = new Object();
                oField[attr] = val;
                parse_attr.push(oField);//将标签里面的属性以对象的方式添加到parse_attr对象中
            })
        });
        var parse_form = new Object({
            'fields': fields,//总字段数
            'template': template,//完整html
            'parse': template_parse,//控件替换为{data_1}的html
            'data': template_data,//控件属性
            'add_fields': add_fields//新增控件
        });
        return JSON.stringify(parse_form);
    }
    /*预览表单*/
    // nReview: function () {
    //     if (leipiEditor.hasContents()) {
    //         leipiEditor.sync();       //同步内容
    //
    //         //创建变量用来保存值
    //         var fields = $("#fields").val(), formeditor = '';
    //         //formeditor重新赋值
    //         formeditor = leipiEditor.getContent();
    //         var parse_form = this.parse_form(formeditor, fields);
    //
    //         var myTemplate = JSON.parse(parse_form).template;
    //
    //         var win_parse = window.open('', '', 'width=800,height=600');
    //         //将保存包的模板数据渲染在新打开的页面
    //         win_parse.document.write(myTemplate);
    //         win_parse.focus();
    //     } else {
    //         alert('表单内容不能为空！');
    //         return false;
    //     }
    // }
};
