//获取url搜索字符串的值
function loadPageVar (sVar) {
    return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

//初始化ueditor（富文本编辑器）
function initUeditor(containerId,content) {
    let html='          <!--loading-->\n' +
        '                    <div class="ui-loader-container">\n' +
        '                        <div class="ui active centered inline loader"></div>\n' +
        '                    </div>\n' +
        '                    <!-- 加载编辑器的容器 -->\n' +
        '                    <div id="ueditorContent" name="content"></div>';
    $('#'+containerId).html(html);
    let ue = UE.getEditor('ueditorContent',{initialFrameHeight:400});
    ue.ready(() => {
        $('.ui-loader-container').remove();
        content && ue.setContent(content);
    });
}

//初始化editormd（markdown编辑器）
function initEditormd(containerId,content) {
    let html='     <div id="editormdContent">\n' +
        '                        <textarea class="editormd-markdown-textarea" name="markdown"></textarea>\n' +
        '                        <!-- 第二个隐藏文本域，用来构造生成的HTML代码，方便表单POST提交，这里的name可以任意取，后台接受时以这个name键为准 -->\n' +
        '                        <textarea class="editormd-html-textarea" name="content"></textarea>\n' +
        '                    </div>';
    $('#'+containerId).html(html);
    let markdownEditor = editormd("editormdContent", {
        width: "100%",
        height: 500,
        path : '/editormd/lib/',
        markdown : content || '',
        codeFold : true,
        //syncScrolling : false,
        saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
        searchReplace : true,
        watch : false,                // 关闭实时预览
        htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
        //toolbar  : false,             //关闭工具栏
        //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
        emoji : true,
        taskList : true,
        tocm            : true,         // Using [TOCM]
        tex : true,                   // 开启科学公式TeX语言支持，默认关闭
        flowChart : true,             // 开启流程图支持，默认关闭
        sequenceDiagram : true,       // 开启时序/序列图支持，默认关闭,
        //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
        //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
        //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
        //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
        //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
        imageUpload : true,
        imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL : "/posts/upload",
        toolbarIcons : function() {
            // Or return editormd.toolbarModes[name]; // full, simple, mini
            // Using "||" set icons align right.
            return ["undo", "redo", "|", "bold", "hr","|","italic", "hr","|","link","image", "||","search", "clear","watch", "fullscreen", "preview", "info", "help",]
        },
        onload : function() {
        }
    });
}