(function($) {

//var af_cookie_name = escape("autofiller_"+ document.location.href);
var cookieobj = new Object();
var excluded_cookies = ["authenticity_token", "af_save_btn", "af_load_btn", "af_log_show_btn", "af_log_clear_btn", "af_hide_btn", "af_version_field"];

var enable_log = false;

//var Persist
	var Persist=(function(){var G="0.1.0",F,I,A,H,E,D;D=(function(){var Q="Thu, 01-Jan-1970 00:00:01 GMT",M=1000*60*60*24,P=["expires","path","domain"],K=escape,L=unescape,R=document,T;var O=function(){var B=new Date();B.setTime(B.getTime());return B};var N=function(X,U){var Y,B,V,W=[],J=(arguments.length>2)?arguments[2]:{};W.push(K(X)+"="+K(U));for(Y=0;Y<P.length;Y++){B=P[Y];if(V=J[B]){W.push(B+"="+V)}}if(J.secure){W.push("secure")}return W.join("; ")};var S=function(){var B="__EC_TEST__",J=new Date();J=J.toGMTString();this.set(B,J);this.enabled=(this.remove(B)==J);return this.enabled};T={set:function(X,U){var Y=(arguments.length>2)?arguments[2]:{},Z=O(),B,J={};if(Y.expires){B=Y.expires*M;J.expires=new Date(Z.getTime()+B);J.expires=J.expires.toGMTString()}var V=["path","domain","secure"];for(i=0;i<V.length;i++){if(Y[V[i]]){J[V[i]]=Y[V[i]]}}var W=N(X,U,J);R.cookie=W;return U},has:function(B){B=K(B);var U=R.cookie,V=U.indexOf(B+"="),J=V+B.length+1,W=U.substring(0,B.length);return((!V&&B!=W)||V<0)?false:true},get:function(X){X=K(X);var U=R.cookie,V=U.indexOf(X+"="),J=V+X.length+1,W=U.substring(0,X.length),B;if((!V&&X!=W)||V<0){return null}B=U.indexOf(";",J);if(B<0){B=U.length}return L(U.substring(J,B))},remove:function(J){var U=T.get(J),B={expires:Q};R.cookie=N(J,"",B);return U},keys:function(){var U=R.cookie,V=U.split("; "),J,W,B=[];for(J=0;J<V.length;J++){W=V[J].split("=");B.push(L(W[0]))}return B},all:function(){var U=R.cookie,V=U.split("; "),J,W,B=[];for(J=0;J<V.length;J++){W=V[J].split("=");B.push([L(W[0]),L(W[1])])}return B},version:"0.2.1",enabled:false};T.enabled=S.call(T);return T}());E=function(){};A=function(B){return"PS"+B.replace(/_/g,"__").replace(/ /g,"_s")};C={search_order:["gears","localstorage","whatwg_db","globalstorage","flash","ie","cookie"],name_re:/^[a-z][a-z0-9_ -%\/\\:\.]+$/i,methods:["init","get","set","remove","load","save"],sql:{version:"1",create:"CREATE TABLE IF NOT EXISTS persist_data (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)",get:"SELECT v FROM persist_data WHERE k = ?",set:"INSERT INTO persist_data(k, v) VALUES (?, ?)",remove:"DELETE FROM persist_data WHERE k = ?"},flash:{div_id:"_persist_flash_wrap",id:"_persist_flash",path:"persist.swf",size:{w:1,h:1},args:{autostart:true}}};I={gears:{size:-1,test:function(){return(window.google&&window.google.gears)?true:false},methods:{transaction:function(J){var B=this.db;B.execute("BEGIN").close();J.call(this,B);B.execute("COMMIT").close()},init:function(){var B;B=this.db=google.gears.factory.create("beta.database");B.open(A(this.name));B.execute(C.sql.create).close()},get:function(B,K,J){var L,M=C.sql.get;if(!K){return }this.transaction(function(N){L=N.execute(M,[B]);if(L.isValidRow()){K.call(J||this,true,L.field(0))}else{K.call(J||this,false,null)}L.close()})},set:function(J,O,L,K){var B=C.sql.remove,N=C.sql.set,M;this.transaction(function(P){P.execute(B,[J]).close();P.execute(N,[J,O]).close();if(L){L.call(K||this,true,O)}})},remove:function(B,K,J){var L=C.sql.get;sql=C.sql.remove,r,val;this.transaction(function(M){if(K){r=M.execute(L,[B]);if(r.isValidRow()){val=r.field(0);M.execute(sql,[B]).close();K.call(J||this,true,val)}else{K.call(J||this,false,null)}r.close()}else{M.execute(sql,[B]).close()}})}}},whatwg_db:{size:200*1024,test:function(){var B="PersistJS Test",J="Persistent database test.";if(!window.openDatabase){return false}if(!window.openDatabase(B,C.sql.version,J,I.whatwg_db.size)){return false}return true},methods:{transaction:function(B){if(!this.db_created){var J=C.sql.create;this.db.transaction(function(K){K.executeSql(J,[],function(){this.db_created=true})},E)}this.db.transaction(B)},init:function(){var J,B;J=this.o.about||"Persistent storage for "+this.name;B=this.o.size||I.whatwg_db.size;this.db=openDatabase(this.name,C.sql.version,J,B)},get:function(B,K,J){var L=C.sql.get;if(!K){return }J=J||this;this.transaction(function(M){M.executeSql(L,[B],function(N,O){if(O.rows.length>0){K.call(J,true,O.rows.item(0)["v"])}else{K.call(J,false,null)}})})},set:function(J,N,L,K){var B=C.sql.remove,M=C.sql.set;this.transaction(function(O){O.executeSql(B,[J],function(){O.executeSql(M,[J,N],function(P,Q){if(L){L.call(K||this,true,N)}})})});return N},remove:function(B,K,J){var L=C.sql.get;sql=C.sql.remove;this.transaction(function(M){if(K){M.executeSql(L,[B],function(N,O){if(O.rows.length>0){var P=O.rows.item(0)["v"];N.executeSql(sql,[B],function(Q,R){K.call(J||this,true,P)})}else{K.call(J||this,false,null)}})}else{M.executeSql(sql,[B])}})}}},globalstorage:{size:5*1024*1024,test:function(){lh=location.host?true:false;ls=window.globalStorage?true:false;all=(lh&&ls);return all},methods:{key:function(B){return A(this.name)+A(B)},init:function(){this.store=globalStorage[this.o.domain]},get:function(B,K,J){B=this.key(B);if(K){K.call(J||this,true,this.store.getItem(B))}},set:function(B,L,K,J){B=this.key(B);this.store.setItem(B,L);if(K){K.call(J||this,true,L)}},remove:function(B,K,J){var L;B=this.key(B);L=this.store[B];this.store.removeItem(B);if(K){K.call(J||this,(L!==null),L)}}}},localstorage:{size:-1,test:function(){lh=location.host?true:false;ls=window.localStorage?true:false;all=(lh&&ls);return all},methods:{key:function(B){return A(this.name)+A(B)},init:function(){this.store=localStorage},get:function(B,K,J){B=this.key(B);if(K){K.call(J||this,true,this.store.getItem(B))}},set:function(B,L,K,J){B=this.key(B);this.store.setItem(B,L);if(K){K.call(J||this,true,L)}},remove:function(B,K,J){var L;B=this.key(B);L=this.getItem(B);this.store.removeItem(B);if(K){K.call(J||this,(L!==null),L)}}}},ie:{prefix:"_persist_data-",size:64*1024,test:function(){return window.ActiveXObject?true:false},make_userdata:function(J){var B=document.createElement("div");B.id=J;B.style.display="none";B.addBehavior("#default#userData");document.body.appendChild(B);return B},methods:{init:function(){var B=I.ie.prefix+A(this.name);this.el=I.ie.make_userdata(B);if(this.o.defer){this.load()}},get:function(B,K,J){var L;B=A(B);if(!this.o.defer){this.load()}L=this.el.getAttribute(B);if(K){K.call(J||this,L?true:false,L)}},set:function(B,L,K,J){B=A(B);this.el.setAttribute(B,L);if(!this.o.defer){this.save()}if(K){K.call(J||this,true,L)}},load:function(){this.el.load(A(this.name))},save:function(){this.el.save(A(this.name))}}},cookie:{delim:":",size:4000,test:function(){return F.Cookie.enabled?true:false},methods:{key:function(B){return this.name+I.cookie.delim+B},get:function(B,K,J){B=this.key(B);val=D.get(B);if(K){K.call(J||this,val!=null,val)}},set:function(B,L,K,J){B=this.key(B);this.o.domain="";this.o.path="";D.set(B,L,this.o);if(K){K.call(J||this,true,L)}},remove:function(B,L,K,J){var L;B=this.key(B);L=D.remove(B);if(K){K.call(J||this,L!=null,L)}}}},flash:{test:function(){if(!window.SWFObject||!deconcept||!deconcept.SWFObjectUtil){return false}var B=deconcept.SWFObjectUtil.getPlayerVersion().major;return(B>=8)?true:false},methods:{init:function(){if(!I.flash.el){var L,J,K,B=C.flash;K=document.createElement("div");K.id=B.div_id;document.body.appendChild(K);L=new SWFObject(this.o.swf_path||B.path,B.id,B.size.w,B.size.h,"8");for(J in B.args){L.addVariable(J,B.args[J])}L.write(K);I.flash.el=document.getElementById(B.id)}this.el=I.flash.el},get:function(B,K,J){var L;B=A(B);L=this.el.get(this.name,B);if(K){K.call(J||this,L!==null,L)}},set:function(J,M,L,K){var B;J=A(J);B=this.el.set(this.name,J,M);if(L){L.call(K||this,true,M)}},remove:function(B,K,J){var L;B=A(B);L=this.el.remove(this.name,B);if(K){K.call(J||this,true,L)}}}}};var H=function(){var M,J,B,L,K=C.methods,N=C.search_order;for(M=0,J=K.length;M<J;M++){F.Store.prototype[K[M]]=E}F.type=null;F.size=-1;for(M=0,J=N.length;!F.type&&M<J;M++){B=I[N[M]];if(B.test()){F.type=N[M];F.size=B.size;for(L in B.methods){F.Store.prototype[L]=B.methods[L]}}else{}}F._init=true};F={VERSION:G,type:null,size:0,add:function(B){I[B.id]=B;C.search_order=[B.id].concat(C.search_order);H()},remove:function(J){var B=C.search_order.indexOf(J);if(B<0){return }C.search_order.splice(B,1);delete I[J];H()},Cookie:D,Store:function(B,J){if(!C.name_re.exec(B)){throw new Error("Invalid name")}if(!F.type){throw new Error("No suitable storage found")}J=J||{};this.name=B;J.domain=J.domain||location.hostname||"localhost.localdomain";this.o=J;J.expires=365*2;J.path=J.path||"/";this.init()}};H();return F})();

var store = new Persist.Store("autofiller");
//var store = new Persist.Store(af_cookie_name());

/*
$.fn.myPlugin = function(settings) {
	var config = {'foo': 'bar'};

	if (settings) $.extend(config, settings);

	this.each(function() {
		// element-specific code here
	});

	return this;
};
*/

$.fn.getStore = function( check_name ) {
	$.log("==== Store Type = "+ Persist.type);
	$.log("====== getting store "+ af_cookie_name());
	//if(check_name && this.length>1) return null;

	var cookie_value;
	//store.get(af_cookie_name, cookie_value);
	store.get(af_cookie_name(), function(ok, val) {
				if (ok) $.log('=== store val = ' + val);
		cookie_value = val;
	});
	if(typeof(cookie_value) != "undefined")
		cookie_value = unescape(cookie_value).replace(/^\s+|\s+$/g, '');
	var a_all_cookies = [];
	var a_temp_cookie = '';
	var cookie_name = '';
	var b_cookie_found = false; // set boolean t/f default f
	var i = '';

	// parse datastore value
	if(cookie_value && cookie_value != "null")
	{
		$.log("====== found autofiller cookie");
		var cvalue;
		a_all_cookies = cookie_value.split( ';' );
		for ( i = 0; i < a_all_cookies.length; i++ )
		{
			a_temp_cookie = a_all_cookies[i].split( '=' );
			cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
			if ( a_temp_cookie.length > 1 )
			{
				cvalue = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			$(cookieobj).data(cookie_name, cvalue);
			//$.log("== set cookieobj for "+ cookie_name +" = ["+ $(cookieobj).data(cookie_name) +"]");
			a_temp_cookie = null;
			cookie_name = '';
		}
	}
	else
	{
		return this;
	}

	this.each(function() {
		$.log("== "+ $(this).id_or_name() +": ["+ $(cookieobj).data( $(this).id_or_name() ) +"]");
		if($(excluded_cookies).index($(this).id_or_name())!=-1)
		{
			$.log("==== excluded: "+ $(this).id_or_name());
		}
		else
		if($(this).attr('type')=='select-one')
		{
			the_index = parseInt($(cookieobj).data( $(this).id_or_name()));
			if(!the_index) the_index = 0;
			$(this).find('option').eq(the_index).attr('selected', true);
		}
		else
		if($(this).attr('type')=='checkbox' || $(this).attr('type')=='radio')
		{
			//$.log("=== cbvalue = ["+ $(cookieobj).data( $(this).id_or_name()) +"]");
			cbvalue = $(cookieobj).data( $(this).id_or_name());
			/*
			if(cbvalue)
			{
				cbvalue = cbvalue.split('|');
				$(this).attr('checked', (cbvalue[0]=='true'?true:false));
				$(this).val(cbvalue[1]);
			}
			*/
			if(cbvalue)
			{
				cbvalue = cbvalue.split('|');
				if(cbvalue[0]=='true')
				{
					$.log("==== click on "+ $(this).attr('type') + ": "+ $(this).attr('id'));
					$(this).get(0).click();
				}
			}
		}
		else $(this).val($(cookieobj).data( $(this).id_or_name() ));
	});

	return this;
}

$.fn.setStore = function ( options) {
	var idata = new Object();

	this.each(function() {
		var name = $(this).id_or_name();
		var value;

		if($(excluded_cookies).index($(this).id_or_name())!=-1)
		{
			$.log("== set excluded: "+ $(this).id_or_name());
		}
		else
		if($(this).attr('type')=='select-one')
		{
			value = $(this).find('option:selected').get(0).index;
		}
		else
		if($(this).attr('type')=='checkbox' || $(this).attr('type')=='radio')
		{
			value = $(this).attr('checked')+"|"+$(this).val();
		}
		else
		{
			value = $(this).val();
		}

		$.log("== set cookie: "+ $(this).attr('type') +": "+ name +" = ["+ value +"]");

		$(idata).data(name, escape(value));
	});

	// create cookie value for save
	var cookie_value = "";
	//$.each($(idata).allData(), function(key, value)
	$.each($(idata).data(), function(key, value)
	{
			//$.log("== cookie_value: "+ key + " = [" + value +"]");
			cookie_value += key +"="+ value +";";
	});

	// save cookie
	$.log("====== save store: "+ af_cookie_name());
	$.log("=== "+ cookie_value);
	store.set(af_cookie_name(), escape( cookie_value));

	return this;
};

$.fn.id_or_name = function()
{
  if(this && this.attr('id') && this.attr('id').length>0) return this.attr('id');
  return this.attr('name');
};

/* not work for jq 1.4
$.fn.allData = function()
{
    var intID = $.data(this.get(0));
    return($.cache[intID]);
};
*/

$.fn.reposition = function()
{
	// get the full width
	//console.log("== obj = "+ $(this).attr('id') +"; parent = "+ $(this).offsetParent().attr('id'));
	//alert("== obj = "+ $(this).attr('id') +"; parent = "+ $(this).offsetParent().attr('id'));
	op = $(this).offsetParent();
	op.css('left', -3000);
	width = op.width();
	wwidth = $(window).width();
	nwidth = wwidth - width - 10 - (navigator.appName == 'Microsoft Internet Explorer' ? 10 : 0);
	op.css('left', nwidth);
	op.css('left', nwidth + "px");
}

$.log = function(msg)
{
	if(!enable_log && ($('#af_log').length>0 && $('#af_log').css('display')=="none")) return;

	if(typeof(console) != "undefined" && enable_log)
	{
	      console.log(msg);
		if(($('#af_log').length>0 && $('#af_log').css('display')!="none"))
		{
			log_msg = $('#af_log').html();
			//console.log(msg);
			$('#af_log').html(log_msg + '<br/>' + msg);
			$("#af_log").animate({ scrollTop: $("#af_log").attr("scrollHeight") }, {duration:500,queue:false});
		}
	}
	else
	{
		if($('#af_log').length>0)
		{
			log_msg = $('#af_log').html();
			//console.log(msg);
			$('#af_log').html(log_msg + '<br/>' + msg);
			$("#af_log").animate({ scrollTop: $("#af_log").attr("scrollHeight") }, {duration:500,queue:false});
		}
	}
};
/*
$.each($('#myelement').allData(), function(key, value) {
	alert(key + "=" + value);
});
*/

// To use, simple do: Get_Cookie('cookie_name');
// replace cookie_name with the real cookie name, '' are required

function setupAutofiller()
{
	$("head").append("<style type='text/css' charset='utf-8'>.af_field{display:"+ (typeof(auto_filler_show)=='undefined' ? 'inline-block' : 'none') +";}</style>");
	$(document.body).append("<div id='auto_filler'/>");
	$('#auto_filler').css("position", "absolute");
	$('#auto_filler').css("top", "50px");
	$('#auto_filler').css("left", -3000);

	$('#auto_filler').append("<input type='button' class='af_field' id='af_save_btn' name='af_save_btn' value='S' alt='Save'/>");
	$('#auto_filler').append("<input type='button' class='af_field' id='af_load_btn' name='af_load_btn' value='Load'/>");
	$('#auto_filler').append("<input type='button' id='af_hide_btn' name='af_hide_btn' value='+'/>");
	$('#auto_filler').append("<div><input type='text' size='10' class='af_field' id='af_version_field' name='af_version_field' value='url version'/></div>");

	$('#af_hide_btn').click(function()
	{
		$('.af_field').toggle();
		$('#af_log:visible').hide();

		$(this).reposition();
		$('#af_log_show_btn').reposition();

		/*
		if($('#af_save_btn:visible').length>0)
		{
			$('#auto_filler').css('left', "88%");
		}
		else
		{
			$('#auto_filler').css('left', "97%");
		}
		*/
	});
	$('#af_save_btn').click(function()
	{
		$(':input').setStore();
		//$(':input').setCookie();

	});
	$('#af_save_btn').hover(function ()
	{
		$(this).val("Save");
		$(this).reposition();
      },
      function () {
		$(this).val("S");
		$(this).reposition();
	});
	$('#af_load_btn').click(function()
	{
		$(':input').getStore(af_cookie_name());
		//$(':input').getCookie(af_cookie_name);
	});
	//$('#af_version_field').hover(function ()
	//{
		//$(this).val("Save");
		//$(this).reposition();
      //},
      //function () {
		//$(this).val("S");
		//$(this).reposition();
	//});

}

function setupAutofillerLog()
{
	$(document.body).append("<div id='af_log_btn_div'/>");
	$('#af_log_btn_div').append("<input type='button' class='af_field' id='af_log_show_btn' name='af_log_show_btn' value='Log'/>");
	$('#af_log_btn_div').css("position", "absolute");
	$('#af_log_btn_div').css("top", (navigator.appName == 'Microsoft Internet Explorer' ? "130px" : "120px"));
	$('#af_log_btn_div').css("left", -3000);

	$('#af_log_btn_div').append("<input type='button' class='af_field' id='af_log_clear_btn' name='af_log_clear_btn' value='X'/>");

	$(document.body).append("<div id='af_log'/>");
	$('#af_log').css("position", "absolute");
	$('#af_log').css("top", (navigator.appName == 'Microsoft Internet Explorer' ? "170px" : "150px"));
	$('#af_log').css("left", "60%");
	$('#af_log').css("width", "39%");
	$('#af_log').css("height", "60%");
	$('#af_log').css("border-top", "solid 2px");
	$('#af_log').css("background-color", "#ffcccc");
	$('#af_log').css("display", "none");
	$('#af_log').css("overflow", "auto");

	$('#af_log_show_btn').click(function()
	{
		// get the full width
		$(this).reposition();
		$('#af_log').toggle();
	});
	$('#af_log_clear_btn').click(function()
	{
		$('#af_log').html('');
	});
	$('#af_log_show_btn').hover(function()
	{
		$(this).val("Show Log");
		$(this).reposition();
      },
      function () {
		$(this).val("Log");
		$(this).reposition();
      });
}

function af_cookie_name () {
	var urlVersion = $('#af_version_field').val();
	var url = "";
	try
	{
		if(urlVersion!=null && urlVersion!="" && urlVersion!="url version")
		{
			urlVersion = '_afv_'+ urlVersion +'_afv_';
		}
		else
		{
			urlVersion = "";
		}
		var key = "_";
		$(':input').each(function()
		{
			key += $(this).id_or_name();
		});
		url = escape("autofiller_"+ document.location.href.replace(document.location.search, "") + key.substring(0, 100)) + urlVersion;
	}
	catch(e)
	{
		$.log("******* Error: "+ e);
		//$.log("******* Please check your RegExp: a literal '?' should be input as '\\?'");
		$.log("******* Your input = "+ urlVersion);
		url = escape("autofiller_"+ document.location.href);
	}
	//$.log("++++++++ "+ url);
	return url;
}

// start code
var inited_autofiller = false;
$.init_autofiller = function()
{
	if(inited_autofiller) return;

	setupAutofiller();
	setupAutofillerLog();

	ipfields = $(':input');

	/*
	ipfields.each(
		function(index)
		{
			$.log("=== field = "+ $(this).id_or_name() +"; type = "+ $(this).attr('type'));
		}
	)
	*/

	// scroll floating div
	afloc = parseInt($('#auto_filler').css("top").substring(0,$('#auto_filler').css("top").indexOf("px")))
	$(window).scroll(function () {
		offset = afloc+$(document).scrollTop()+"px";
		$('#auto_filler').animate({top:offset},{duration:500,queue:false});
	});
	bfloc = parseInt($('#af_log').css("top").substring(0,$('#af_log').css("top").indexOf("px")))
	$(window).scroll(function () {
		offset = bfloc+$(document).scrollTop()+"px";
		$('#af_log').animate({top:offset},{duration:500,queue:false});
	});
	cfloc = parseInt($('#af_log_btn_div').css("top").substring(0,$('#af_log_btn_div').css("top").indexOf("px")))
	$(window).scroll(function () {
		offset = cfloc+$(document).scrollTop()+"px";
		$('#af_log_btn_div').animate({top:offset},{duration:500,queue:false});
	});

	// reposition + icon
	$('#af_hide_btn').reposition();

	return true;

};

inited_autofiller = $.init_autofiller();

})(jQuery);



