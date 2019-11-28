

<!-- 奥弗瑞java服务器调用ip和端口 -->
var  host_java='192.168.0.251';
var  port_java=8080;
var  agencyKey='ofr007';

<!-- 奥弗瑞nodejs服务器端口 -->
var  node_port='3000';

<!-- 奥弗瑞全局名（页面全局变量）-->
var  entryname = '奥弗瑞';


var rpc = require('./rpc/json-rpc2');
var client = rpc.Client.$create(port_java, host_java,agencyKey);
global.host = host_java;
global.port = port_java;
global.agencyKey = agencyKey;
global.client = client;
global.node_port = node_port;

global.entryname = entryname;
