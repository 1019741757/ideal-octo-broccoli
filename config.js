

<!-- 切换公司：'OFRI'为奥弗瑞   'xyzn'迅优智能  'XYAF'先佑安防-->
    //var  company='OFRI';//奥弗瑞
    //var  company='XYZN';//迅优智能
	var  company='XYAF';//先佑安防

<!-- 切换环境：'dev'为开发环境配置，输入'prod' 为正式环境配置 -->
     var  env='dev';
     //var  env='prod';


  <!-- pc版当前版本号 -->
    var  version= "3.0.0" ;








global.company = company;
var config = require('./config_'+company+'_'+env);
