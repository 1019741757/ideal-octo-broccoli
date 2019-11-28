

<!-- 先佑安防java服务器调用ip和端口 -->
var  host_java='127.0.0.1';
var  port_java= 18080;
var  agencyKey='XYAF';

<!-- 先佑安防nodejs服务器端口 -->
var  node_port='3002';

<!-- 先佑安防全局名（页面全局变量）-->
var  entryname = '先佑安防';

var rpc = require('./rpc/json-rpc2');
var client = rpc.Client.$create(port_java, host_java,agencyKey);
global.host = host_java;
global.port = port_java;
global.agencyKey = agencyKey;
global.client = client;
global.node_port = node_port;

global.entryname = entryname;
