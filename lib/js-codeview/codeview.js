/*
 +-------------------------------------------------------------------+
 |                 J S - C O D E V I E W   (v1.3)                    |
 |                                                                   |
 | Copyright Gerd Tentler              www.gerd-tentler.de/tools     |
 | Created: Feb. 8, 2011               Last modified: Feb. 19, 2011  |
 +-------------------------------------------------------------------+
 | This program may be used and hosted free of charge by anyone for  |
 | personal purpose as long as this copyright notice remains intact. |
 |                                                                   |
 | Obtain permission before selling the code for this program or     |
 | hosting this software on a commercial website or redistributing   |
 | this software over the Internet or in any other medium. In all    |
 | cases copyright must remain intact.                               |
 +-------------------------------------------------------------------+

 ===========================================================================================================
 This script was tested with the following systems and browsers:

 - Windows: IE, Opera, Firefox, Chrome

 If you use another browser or system, this script may not work for you - sorry.

 For instructions on how to use this script, read the README file or visit my website:
 http://www.gerd-tentler.de/tools/codeview/
 ===========================================================================================================
 */
define([
], function (
)
{
//---------------------------------------------------------------------------------------------------------
// Add new methods to Function prototype - needed to pass viewer instance to event handlers etc.
//---------------------------------------------------------------------------------------------------------
    Function.prototype.bind = function () {
        var _this = this, args = [], object = arguments[0];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        return function () {
            return _this.apply(object, args);
        }
    }

    Function.prototype.bindAsEventListener = function () {
        var _this = this, args = [], object = arguments[0];
        for (var i = 1; i < arguments.length; i++) args[i + 1] = arguments[i];
        return function (e) {
            args[0] = e || event;
            return _this.apply(object, args);
        }
    }

//---------------------------------------------------------------------------------------------------------
// Global variables and functions
//---------------------------------------------------------------------------------------------------------
    var OP = (window.opera || navigator.userAgent.indexOf('Opera') != -1);
    var WK = (navigator.userAgent.indexOf('WebKit') != -1 && !OP);

    function CodeView(node, options, id) {
//---------------------------------------------------------------------------------------------------------
// Initialization
//---------------------------------------------------------------------------------------------------------
        this.node = node;
        this.id = id;
        this.language = options[0] ? options[0].toLowerCase() : '';
        this.viewLineNumbers = tools.inArray('lineNumbers', options, true);
        this.textWidth = node.offsetWidth;
        this.textHeight = node.offsetHeight;
        this.bgColor = this.node.style.backgroundColor ? this.node.style.backgroundColor : '#FFFFFF';
        this.content = tools.trim(this.node.innerHTML);
        this.iframe = null;
        this.canvas = null;
        this.numbers = null;
        this.numbersCont = null;

//---------------------------------------------------------------------------------------------------------
// Class methods
//---------------------------------------------------------------------------------------------------------
        this.create = function () {
            this.node.style.overflow = 'hidden';
            if (!this.node.style.borderWidth) this.node.style.border = '1px solid #808080';
            this.setSize();
            this.setLanguageStyle();

            if (this.viewLineNumbers) {
                this.numbersCont = document.createElement('div');
                this.numbersCont.style.width = '40px';
                this.numbersCont.style.height = '100%';
                this.numbersCont.style.styleFloat = 'left';
                this.numbersCont.style.cssFloat = 'left';
                this.numbersCont.style.overflow = 'hidden';
                this.numbersCont.style.borderRight = '1px solid #808080';
                this.numbersCont.style.backgroundColor = '#F0F0F0';
                this.node.appendChild(this.numbersCont);

                this.numbers = document.createElement('div');
                this.numbers.style.textAlign = 'right';
                this.numbers.style.padding = '4px';
                this.numbers.style.color = '#808080';
                this.numbers.style.fontFamily = 'Monospace';
                this.numbers.style.fontSize = '13px';
                this.numbersCont.appendChild(this.numbers);

                tools.setUnselectable(this.numbers);
                this.setNumbers();
                this.textWidth -= 41;
            }

            if (this.createIFrame()) {
                if (this.content != '') {
                    this.content = this.content.replace(/</g, '&lt;');
                    this.content = this.content.replace(/>/g, '&gt;');
                    this.setCode(this.content);
                    this.syntaxHilight();
                }
            }
            else alert("Could not create code viewer");

            this.node.style.visibility = 'visible';
        }

        this.createIFrame = function () {
            var iframe, html;

            iframe = document.createElement('iframe');
            iframe.frameBorder = 0;
            iframe.style.width = this.textWidth + 'px';
            iframe.style.height = '100%';
            iframe.style.backgroundColor = this.bgColor;
            this.node.appendChild(iframe);

            html = '<!doctype html>' +
                '<html><head><style type="text/css"> ' +
                '* { box-sizing:content-box; -moz-box-sizing:content-box; -ms-box-sizing:content-box; } ' +
                'body { ' +
                'margin: 4px; ' +
                'background-color: ' + this.bgColor + '; ' +
                'white-space: nowrap; ' +
                'color: #000000; ' +
                'font-family: Monospace; ' +
                'font-size: 13px; ' +
                '} ' +
                'p { margin: 0px; } ' +
                this.setLanguageStyle() +
                '</style></head>' +
                '<body></body></html>';

            if (iframe.contentWindow) this.iframe = iframe.contentWindow;
            else if (document.frames) this.iframe = document.frames[this.id];

            if (this.iframe) {
                this.iframe.document.open();
                this.iframe.document.write(html);
                this.iframe.document.close();
                this.canvas = this.iframe.document.body;
                tools.addListener(this.iframe, 'scroll', this.scrollHandler.bindAsEventListener(this));
                return true;
            }
            return false;
        }

        this.setSize = function () {
            var i, val;
            var offWidth = offHeight = 0;
            var offWidths = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];
            var offHeights = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];

            for (i in offWidths) {
                val = parseInt(this.node.style[offWidths[i]]);
                if (!isNaN(val)) offWidth += val;
            }

            for (i in offHeights) {
                val = parseInt(this.node.style[offHeights[i]]);
                if (!isNaN(val)) offHeight += val;
            }
            if (this.node.style.height == '') this.node.style.height = this.node.offsetHeight + 'px';
            if (this.node.style.width == '') this.node.style.width = this.node.offsetWidth + 'px';
            this.textWidth = this.node.offsetWidth - offWidth;
            this.textHeight = this.node.offsetHeight - offHeight;
            this.node.innerHTML = '';
        }

        this.setLanguageStyle = function () {
            var map = languages[this.language];
            var style = 'u, tt, b, s, i, em, ins { text-decoration: none; font-style: normal; font-weight: normal; } ';
            for (var key in map) if (map[key].style) style += map[key].style + ' ';
            return style;
        }

        this.setNumbers = function () {
            var lines = this.content.split(/\n/);
            var cnt = lines.length;
            var numbers = [];
            cnt += 10;
            for (var i = 1; i <= cnt; i++) numbers.push(i);
            this.numbers = tools.replaceHtml(this.numbers, numbers.join('<br>'));
        }

        this.getCode = function (convSpecialChars) {
            var code = this.canvas.innerHTML.replace(/[\r\n]/g, '');
            if (code) {
                if (OP) {
                    /* ugly workaround for Opera */
                    code = code.replace(/<p>(.*?)<br><\/p>/gi, '$1\n');
                }
                else if (WK) {
                    /* ugly workaround for Chrome */
                    code = code.replace(/<div>(.*?)<br><\/div>/gi, '$1\n');
                }
                code = code.replace(/<(p|div)>(.*?)<\/(p|div)>/gi, '$2\n');
                code = code.replace(/<br>/gi, '\n');
                code = code.replace(/(&nbsp;){4}/g, '\t');
                code = code.replace(/&nbsp;/g, ' ');
                code = code.replace(/<[^>]+>/g, '');

                if (convSpecialChars) {
                    code = code.replace(/&amp;/g, '&');
                    code = code.replace(/&lt;/g, '<');
                    code = code.replace(/&gt;/g, '>');
                }
            }
            return code;
        }

        this.setCode = function (code) {
            code = code.replace(/\r?\n/g, '<br>');
            code = code.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
            code = code.replace(/\s/g, '&nbsp;');
            this.canvas = tools.replaceHtml(this.canvas, code);
            if (this.numbers) setTimeout(this.scrollHandler.bind(this), 50);
        }

        this.parseCode = function (code) {
            var map, key, i;
            if (map = languages[this.language]) for (key in map) {
                if (map[key].match) for (i = 0; i < map[key].match.length; i++) {
                    code = code.replace(map[key].match[i], map[key].replace[i]);
                }
            }
            return code;
        }

        this.syntaxHilight = function () {
            var code = this.parseCode(this.getCode());
            this.setCode(code);
        }

//---------------------------------------------------------------------------------------------------------
// Event handlers
//---------------------------------------------------------------------------------------------------------
        this.scrollHandler = function (e) {
            var scrTop = this.canvas.scrollTop ? this.canvas.scrollTop : this.canvas.parentNode.scrollTop;
            if (this.numbersCont) this.numbersCont.scrollTop = scrTop;
        }
    }

//---------------------------------------------------------------------------------------------------------
// Little helpers
//---------------------------------------------------------------------------------------------------------
    var tools = {

        inArray: function (val, arr, ignoreCase) {
            var str = '|' + arr.join('|') + '|';
            if (ignoreCase) {
                str = str.toLowerCase();
                val = val.toLowerCase();
            }
            return (str.indexOf('|' + val + '|') != -1);
        },

        addListener: function (obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false);
            }
            else if (obj.attachEvent) {
                obj.attachEvent('on' + type, fn);
            }
        },

        setUnselectable: function (node) {
            node.unselectable = true;
            node.style.MozUserSelect = 'none';
            node.onmousedown = function () {
                return false;
            }
            node.style.cursor = 'default';
        },

        replaceHtml: function (node, html) {
            /*@cc_on // pure innerHTML is slightly faster in IE
             node.innerHTML = html;
             return node;
             @*/
            var newNode = node.cloneNode(false);
            newNode.innerHTML = html;
            node.parentNode.replaceChild(newNode, node);
            return newNode;
        },

        trim: function (val) {
            val = val.replace(/^\s+/, '');
            val = val.replace(/\s+$/, '');
            return val;
        }
    }

//---------------------------------------------------------------------------------------------------------
// Convert PRE tags
//---------------------------------------------------------------------------------------------------------
    tools.addListener(window, 'load', function () {
        var nodes = document.getElementsByTagName('pre');
        var options = cvos = [];

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].className.match(/^codeview(\s+(.+))?/i)) {
                options = RegExp.$2.split(/\s+/);
                cvos.push(new CodeView(nodes[i], options, 'codeView_' + (i + 1)));
            }
        }
        for (i in cvos) cvos[i].create();
    });

//---------------------------------------------------------------------------------------------------------
// Convert PRE tags
//---------------------------------------------------------------------------------------------------------
    tools.scan = function () {
        var nodes = document.getElementsByTagName('pre');
        var options = cvos = [];

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].className.match(/^codeview(\s+(.+))?/i)) {
                options = RegExp.$2.split(/\s+/);
                cvos.push(new CodeView(nodes[i], options, 'codeView_' + (i + 1)));
            }
        }
        for (i in cvos) cvos[i].create();
    };

//---------------------------------------------------------------------------------------------------------
// Supported languages
//---------------------------------------------------------------------------------------------------------
    var languages = {

        javascript: {
            operators: {
                match: [ /\/\*/g, /\*\//g, /\/\//g, /((&amp;)+|(&lt;)+|(&gt;)+|[\|!=%\*\/\+\-]+)/g, /\u0002/g, /\u0003/g, /\u0004/g ],
                replace: [ '\u0002', '\u0003', '\u0004', '<tt>$1</tt>', '/*', '*/', '//' ],
                style: 'tt { color: #C00000; }'
            },
            brackets: {
                match: [ /([\(\)\{\}\[\]])/g ],
                replace: [ '<b>$1</b>' ],
                style: 'b { color: #A000A0; font-weight: bold; }'
            },
            numbers: {
                match: [ /\b(-?\d+)\b/g ],
                replace: [ '<u>$1</u>' ],
                style: 'u { color: #C00000; }'
            },
            keywords: {
                match: [ /\b(break|case|catch|const|continue|default|delete|do|else|export|false|finally|for|function|if|in|instanceof|new|null|return|switch|this|throw|true|try|typeof|undefined|var|void|while|with)\b/g ],
                replace: [ '<em>$1</em>' ],
                style: 'em { color: #0000C0; }'
            },
            strings: {
                match: [ /(".*?")/g, /('.*?')/g ],
                replace: [ '<s>$1</s>', '<s>$1</s>' ],
                style: 's, s u, s tt, s b, s em, s i { color: #008000; font-weight: normal; }'
            },
            comments: {
                match: [ /(\/\/[^\n]*)(\n|$)/g, /(\/\*)/g, /(\*\/)/g ],
                replace: [ '<i>$1</i>$2', '<i>$1', '$1</i>' ],
                style: 'i, i u, i tt, i b, i s, i em { color: #808080; font-weight: normal; }'
            }
        },

        php: {
            tags: {
                match: [ /&lt;(\/?(a|abbr|acronym|address|applet|area|b|base|basefont|bdo|big|blockquote|body|br|button|caption|center|cite|code|col|colgroup|dd|del|dfn|dir|div|dl|dt|em|fieldset|font|form|frame|frameset|h[1-6]|head|hr|html|i|iframe|img|input|ins|isindex|kbd|label|legend|li|link|map|menu|meta|noframes|noscript|object|ol|optgroup|option|p|param|pre|q|s|samp|script|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|tt|u|ul|var)(\s+.*?)?)&gt;/gi ],
                replace: [ '��$1���' ]
            },
            operators: {
                match: [ /\/\*/g, /\*\//g, /\/\//g, /((&amp;)+|(&lt;)+|(&gt;)+|[\|!=%\*\/\+\-]+)/g, /\u0002/g, /\u0003/g, /\u0004/g, /��(.+?)���/g ],
                replace: [ '\u0002', '\u0003', '\u0004', '<tt>$1</tt>', '/*', '*/', '//', '<em>&lt;$1&gt;</em>' ],
                style: 'tt { color: #C00000; }'
            },
            brackets: {
                match: [ /([\(\)\{\}\[\]])/g, /(<tt>)?&lt;(<\/tt>)?\?(php)?/gi, /\?(<tt>)?&gt;(<\/tt>)?/gi ],
                replace: [ '<b>$1</b>', '<b>&lt;?$3</b>', '<b>?&gt;</b>' ],
                style: 'b { color: #A000A0; font-weight: bold; }'
            },
            numbers: {
                match: [ /\b(-?\d+)\b/g ],
                replace: [ '<u>$1</u>' ],
                style: 'u { color: #C00000; }'
            },
            keywords: {
                match: [ /\b(__CLASS__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|abstract|and|array|as|break|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exception|exit|extends|final|false|for|foreach|function|global|if|implements|include|include_once|interface|isset|list|new|or|print|private|protected|public|require|require_once|return|static|switch|this|throw|true|try|unset|use|var|while|xor)\b/g ],
                replace: [ '<em>$1</em>' ],
                style: 'em, em tt { color: #0000C0; font-weight: normal; }'
            },
            variables: {
                match: [ /(\$)(<[^>]+>)?(\w+)(<\/[^>]+>)?\b/gi ],
                replace: [ '<ins>$1$3</ins>' ],
                style: 'ins { color: #909000; }'
            },
            strings: {
                match: [ /(".*?")/g, /('.*?')/g ],
                replace: [ '<s>$1</s>', '<s>$1</s>' ],
                style: 's, s u, s tt, s b, s em, s ins, s i { color: #008000; font-weight: normal; }'
            },
            comments: {
                match: [ /(\/\/[^\n]*)(\n|$)/g, /(#[^\n]*)(\n|$)/g, /(\/\*)/g, /(\*\/)/g, /(<tt>)?&lt;(<\/tt><tt>)?!--(<\/tt>)/gi, /(<tt>)?--(<\/tt><tt>)?&gt;(<\/tt>)?/gi ],
                replace: [ '<i>$1</i>$2', '<i>$1</i>$2', '<i>$1', '$1</i>', '<i>&lt;!--', '--&gt;</i>' ],
                style: 'i, i u, i tt, i b, i s, i em, i ins { color: #808080; font-weight: normal; }'
            }
        },

        html: {
            scriptAreas: {
                match: [ /(&lt;script(.*?)&gt;)/gi, /(&lt;\/script&gt;)/gi ],
                replace: [ '$1<tt>', '</tt>$1' ],
                style: 'tt { color: #909000; }'
            },
            styleAreas: {
                match: [ /(&lt;style(.*?)&gt;)/gi, /(&lt;\/style&gt;)/gi ],
                replace: [ '$1<b>', '</b>$1' ],
                style: 'b { color: #A000A0; }'
            },
            tags: {
                match: [ /(&lt;\/?(a|abbr|acronym|address|applet|area|b|base|basefont|bdo|big|blockquote|body|br|button|caption|center|cite|code|col|colgroup|dd|del|dfn|dir|div|dl|dt|em|fieldset|font|form|frame|frameset|h[1-6]|head|hr|html|i|iframe|img|input|ins|isindex|kbd|label|legend|li|link|map|menu|meta|noframes|noscript|object|ol|optgroup|option|p|param|pre|q|s|samp|script|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|tt|u|ul|var)(\s+.*?)?&gt;)/gi ],
                replace: [ '<em>$1</em>' ],
                style: 'em { color: #0000C0; }'
            },
            strings: {
                match: [ /=(".*?")/g, /=('.*?')/g ],
                replace: [ '=<s>$1</s>', '=<s>$1</s>' ],
                style: 's, s tt, s b, s em, s i { color: #008000; }'
            },
            comments: {
                match: [ /(&lt;!--)/g, /(--&gt;)/g ],
                replace: [ '<i>$1', '$1</i>' ],
                style: 'i, i tt, i b, i s, i em { color: #808080; }'
            }
        },

        css: {
            classes: {
                match: [ /(.+?)\{/g ],
                replace: [ '<tt>$1</tt>{' ],
                style: 'tt { color: #0000C0; }'
            },
            keys: {
                match: [ /([\{\n]\s*)([\w\-]*?:)([^\/])/g ],
                replace: [ '$1<u>$2</u>$3', ':' ],
                style: 'u { color: #C00000; }'
            },
            brackets: {
                match: [ /([\{\}])/g ],
                replace: [ '<b>$1</b>' ],
                style: 'b { color: #A000A0; font-weight: bold; }'
            },
            comments: {
                match: [ /(\/\*)/g, /(\*\/)/g ],
                replace: [ '<i>$1', '$1</i>' ],
                style: 'i, i tt, i u, i b { color: #808080; font-weight: normal; }'
            }
        },

        perl: {
            tags: {
                match: [ /&lt;(\/?(a|abbr|acronym|address|applet|area|b|base|basefont|bdo|big|blockquote|body|br|button|caption|center|cite|code|col|colgroup|dd|del|dfn|dir|div|dl|dt|em|fieldset|font|form|frame|frameset|h[1-6]|head|hr|html|i|iframe|img|input|ins|isindex|kbd|label|legend|li|link|map|menu|meta|noframes|noscript|object|ol|optgroup|option|p|param|pre|q|s|samp|script|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|tt|u|ul|var)(\s+.*?)?)&gt;/gi ],
                replace: [ '��$1���' ]
            },
            operators: {
                match: [ /((&amp;)+|(&lt;)+|(&gt;)+|[\|=\+\-]+|[!%\*\/~])/g, /��(.+?)���/g ],
                replace: [ '<tt>$1</tt>', '<em>&lt;$1&gt;</em>' ],
                style: 'tt { color: #C00000; }'
            },
            brackets: {
                match: [ /([\(\)\{\}\[\]])/g ],
                replace: [ '<b>$1</b>' ],
                style: 'b { color: #A000A0; font-weight: bold; }'
            },
            numbers: {
                match: [ /\b(-?\d+)\b/g ],
                replace: [ '<u>$1</u>' ],
                style: 'u { color: #C00000; }'
            },
            keywords: {
                match: [ /\b(abs|accept|alarm|atan2|bind|binmode|bless|caller|chdir|chmod|chomp|chop|chown|chr|chroot|close|closedir|connect|continue|cos|crypt|dbmclose|dbmopen|defined|delete|die|do|dump|each|else|elsif|endgrent|endhostent|endnetent|endprotoent|endpwent|eof|eval|exec|exists|exit|fcntl|fileno|find|flock|for|foreach|fork|format|formlinegetc|getgrent|getgrgid|getgrnam|gethostbyaddr|gethostbyname|gethostent|getlogin|getnetbyaddr|getnetbyname|getnetent|getpeername|getpgrp|getppid|getpriority|getprotobyname|getprotobynumber|getprotoent|getpwent|getpwnam|getpwuid|getservbyaddr|getservbyname|getservbyport|getservent|getsockname|getsockopt|glob|gmtime|goto|grep|hex|hostname|if|import|index|int|ioctl|join|keys|kill|last|lc|lcfirst|length|link|listen|LoadExternals|local|localtime|log|lstat|map|mkdir|msgctl|msgget|msgrcv|msgsnd|my|next|no|oct|open|opendir|ordpack|package|pipe|pop|pos|print|printf|push|pwd|qq|quotemeta|qw|rand|read|readdir|readlink|recv|redo|ref|rename|require|reset|return|reverse|rewinddir|rindex|rmdir|scalar|seek|seekdir|select|semctl|semget|semop|send|setgrent|sethostent|setnetent|setpgrp|setpriority|setprotoent|setpwent|setservent|setsockopt|shift|shmctl|shmget|shmread|shmwrite|shutdown|sin|sleep|socket|socketpair|sort|splice|split|sprintf|sqrt|srand|stat|stty|study|sub|substr|symlink|syscall|sysopen|sysread|system|syswritetell|telldir|tie|tied|time|times|tr|truncate|uc|ucfirst|umask|undef|unless|unlink|until|unpack|unshift|untie|use|utime|values|vec|waitpid|wantarray|warn|while|write)\b/g ],
                replace: [ '<em>$1</em>' ],
                style: 'em, em tt { color: #0000C0; font-weight: normal; }'
            },
            variables: {
                match: [ /(<tt>)?([\$@%])(<\/tt>)?(<[^>]+>)?(\w+)(<\/[^>]+>)?\b/gi ],
                replace: [ '<ins>$2$5</ins>' ],
                style: 'ins { color: #909000; }'
            },
            strings: {
                match: [ /(".*?")/g, /('.*?')/g ],
                replace: [ '<s>$1</s>', '<s>$1</s>' ],
                style: 's, s u, s tt, s b, s em, s ins, s i { color: #008000; font-weight: normal; }'
            },
            comments: {
                match: [ /(#[^\n]*)(\n|$)/g, /(<tt>)?&lt;(<\/tt><tt>)?!--(<\/tt>)/gi, /(<tt>)?--(<\/tt><tt>)?&gt;(<\/tt>)?/gi ],
                replace: [ '<i>$1</i>$2', '<i>&lt;!--', '--&gt;</i>' ],
                style: 'i, i u, i tt, i b, i s, i em, i ins { color: #808080; font-weight: normal; }'
            }
        },

        xml: {
            tags: {
                match: [ /(&lt;\/?([\w\-:]+)(\s+.*?)?\/?&gt;)/gi ],
                replace: [ '<em>$1</em>' ],
                style: 'em { color: #0000C0; }'
            },
            attributes: {
                match: [ /([\w\-:]+)=(".*?")/g, /([\w\-]+)=('.*?')/g ],
                replace: [ '<u>$1</u>=<s>$2</s>', '<u>$1</u>=<s>$2</s>' ],
                style: 'u { color: #C00000; } s, s u, s em, s i { color: #008000; }'
            },
            comments: {
                match: [ /(&lt;!--)/g, /(--&gt;)/g ],
                replace: [ '<i>$1', '$1</i>' ],
                style: 'i, i u, i em { color: #808080; }'
            }
        },

        sql: {
            operators: {
                match: [ /((&amp;)+|(&lt;)+|(&gt;)+|[\|=]+|[!%\*\/\+\-])/gi ],
                replace: [ '<tt>$1</tt>' ],
                style: 'tt { color: #C00000; }'
            },
            numbers: {
                match: [ /\b(-?\d+)\b/g ],
                replace: [ '<u>$1</u>' ],
                style: 'u { color: #C00000; }'
            },
            commands: {
                match: [ /\b(abort|alter|analyze|begin|call|checkpoint|close|cluster|comment|commit|copy|create|deallocate|declare|delete|drop|end|execute|explain|fetch|grant|insert|listen|load|lock|move|notify|optimize|prepare|reindex|replace|reset|restart|revoke|rollback|select|set|show|start|truncate|unlisten|update)\b/gi ],
                replace: [ '<em>$1</em>' ],
                style: 'em { color: #0000C0; font-weight: bold; }'
            },
            keywords: {
                match: [ /\b(accessible|add|after|aggregate|alias|all|and|as|asc|authorization|auto_increment|between|both|by|cascade|cache|cache|called|cascade|case|character\s+set|charset|check|collate|column|comment|constraint|createdb|createuser|cycle|databases?|default|deferrable|deferred|delayed|desc|diagnostics|distinct(row)?|domain|duplicate|each|else|else?if|encrypted|except|exception|exists|false|fixed|for|force|foreign|from|full|function|get|group|having|high_priority|if|immediate|immutable|in|increment|index|inherits|initially|inner|input|intersect|into|invoker|is|join|key|language|left|like|limit|local|loop|low_priority|match|maxvalue|minvalue|natural|nextval|no|nocreatedb|nocreateuser|not|null|of|offset|oids|on|only|operator|or|order|outer|owner|partial|password|perform|plpgsql|primary|record|references|require|restrict|returns?|right|row|rule|schemas?|security|sensitive|separator|sequence|session|spatial|sql|stable|statistics|table|temp|temporary|terminated|then|to|trailing|transaction|trigger|true|type|unencrypted|union|unique|unsigned|user|using|valid|values?|view|volatile|when|where|while|with(out)?|xor|zerofill|zone)\b/gi ],
                replace: [ '<b>$1</b>' ],
                style: 'b { color: #0000E0; }'
            },
            types: {
                match: [ /\b(bigint|bigserial|binary|bit|blob|bool(ean)?|box|bytea|char(acter)?|cidr|circle|date(time)?|dec(imal)?|double|enum|float[48]?|inet|int[248]?|integer|interval|line|longblob|longtext|lseg|macaddr|mediumblob|mediumint|money|numeric|oid|path|point|polygon|precision|real|refcursor|serial[48]?|smallint|text|time(stamp)?|tinyblob|tinyint|varbinary|varbit|varchar(acter)?|year)\b/gi ],
                replace: [ '<ins>$1</ins>' ],
                style: 'ins { color: #909000; }'
            },
            strings: {
                match: [ /(".*?")/g, /('.*?')/g ],
                replace: [ '<s>$1</s>', '<s>$1</s>' ],
                style: 's, s b, s u, s tt, s em, s ins, s i { color: #008000; font-weight: normal; }'
            },
            comments: {
                match: [ /(#[^\n]*)(\n|$)/g ],
                replace: [ '<i>$1</i>$2' ],
                style: 'i, i b, i tt, i u, i s, i em, i ins { color: #808080; font-weight: normal; }'
            }
        }
    }
    return tools;
});