var app = new Vue({
	el: '#root',
	data: {
		title: ['Митинг рум 1','Кофейня','Триугольник','Митинг рум 2','Митинг  рум 3','Митинг рум 4'],
		actmodal: '',
		caption: '',
		startTime:'',
		outTime: ''
	},
	mounted() {
		var now = new Date();
        var min = parseFloat(now.getMinutes())+2;
        var hour = parseFloat(now.getHours())+1;
        var mon = parseFloat(now.getMonth())+1;
        $('#startTime').val(parseFloat(now.getYear())+1900+'-'+mon+'-'+now.getDate()+'T'+now.getHours()+':'+min);
        $('#outTime').val(parseFloat(now.getYear())+1900+'-'+mon+'-'+now.getDate()+'T'+hour+':'+min);
		setInterval(this.localGet,1000);
		this.localGet()
		for(var i=0;i<6;i++){
		$('#item'+i).addClass('green');
		}
		var min = now.getMinutes();
		if(min<10) min = '0'+min;
		month = now.getMonth();
	},
	methods: {
		openModal(modal_ID){
			this.actmodal = modal_ID.replace('modal','');
			$('#set').attr('disabled','disabled');
		},
		validDate(){
			var startTime = new Date($('#startTime').val());
			var outTime = new Date($('#outTime').val());
			var now = new Date();
			startTime = startTime.getTime();
			outTime = outTime.getTime();
			now = now.getTime();
			var err = $("#err");
            err.fadeOut(0); 
            if(!isNaN(startTime) && !isNaN(outTime)){
            	if(startTime < now){
            		$('#set').attr('disabled','disabled');
            		err.fadeIn(200).html('Начальное время меньше, либо равно текущему!');
               	}else if(startTime>=outTime){
               		$('#set').attr('disabled','disabled');
               		err.fadeIn(200).html('Конечное время меньше, либо равно начальной!');
	           	}else{
	           		if(this.caption.length>=5 && this.caption.length<=60){
	           			var bool=true;
	           			if(localStorage.getItem('stD'+this.actmodal) && localStorage.getItem('stD'+this.actmodal).length>0){
		           			var times1 = localStorage.getItem('stD'+this.actmodal).split(',');
		           			var times2 = localStorage.getItem('outD'+this.actmodal).split(',');
		           			for(var i=0;i<times1.length;i++){
		           				if((startTime>=times1[i] && startTime<=times2[i]) || (outTime>=times1[i] && outTime<=times2[i]) || (startTime>=times1[i] && outTime<=times2[i]) || (startTime<=times1[i] && outTime>=times2[i])){
		           					bool = false;
		           				}
		           			}
		           		}
		           		if(bool){
			           		$('#set').removeAttr('disabled');
			           		err.fadeOut(100);
			           		this.startTime=startTime;
			           		this.outTime=outTime;
		           		}else{
		           			$('#set').attr('disabled','disabled');
		           			err.fadeIn(200).html('Время, которое вы выбрали, недоступно!');
		           		}
		           	}else{
		           		$('#set').attr('disabled','disabled');
	           			err.fadeIn(200).html('Напишите короткое описание!');
	           		}
	           	}
            }else{
            	$('#set').attr('disabled','disabled');
            	err.fadeIn(200).html('Заполните форму!');
            }
		},
		localSet(){
			var id=this.actmodal;
			if(localStorage.getItem('stD'+id) && localStorage.getItem('stD'+id).length>0){
				var getSTD = localStorage.getItem('stD'+id).split(',');
				var getOUTD = localStorage.getItem('outD'+id).split(',');
				var getTEXT = localStorage.getItem('text'+id).split('||||');
				if(getSTD.length>=1 && getSTD[getSTD.length-1]<this.startTime) {
					alert('tomax');
					getSTD = getSTD+","+this.startTime;
					getOUTD = getOUTD+","+this.outTime;
					getTEXT = getTEXT+"||||"+this.caption;
				}else if(getSTD.length>=1 && getSTD[0]>this.startTime){
					alert('tomin');
					getSTD = this.startTime+","+getSTD;
					getOUTD = this.outTime+","+getOUTD;
					getTEXT = this.caption+"||||"+getTEXT;
				}else{
					for(var i=1;i<getSTD.length-1;i++){
						if(this.startTime>=getSTD[i] && this.startTime<=getSTD[i+1]){
							getSTD[i] = getSTD[i]+","+this.startTime;       // getSTD.splice(i+1,0,this.startTime);
							getOUTD[i] = getOUTD[i]+","+this.outTime;      // getOUTD.splice(i+1,0,this.outTime);
							getTEXT[i] = getTEXT[i]+"||||"+this.caption;      // getTEXT.splice(i+1,0,this.caption);
						}
					}
				}	
				this.startTime = getSTD;
				this.outTime = getOUTD;
				this.caption = getTEXT.join('||||');	
			}
			localStorage.setItem('stD'+id,this.startTime);	
			localStorage.setItem('outD'+id,this.outTime);	
			localStorage.setItem('text'+id,this.caption);
			this.startTime ="";
			this.outTime = "";
			this.caption = "";	
		},
		localGet(){
			var now = new Date();
			var nowTime = now.getTime();
			for(var i=0;i<6;i++){
				if(localStorage.getItem('stD'+i) && localStorage.getItem('stD'+i).length>0){
					var getSTD = localStorage.getItem('stD'+i).split(',');
					var getOUTD = localStorage.getItem('outD'+i).split(',');
					var getTEXT = localStorage.getItem('text'+i).split('||||');
					for(var j=0;j<getOUTD.length;j++){
							var sTime = new Date(parseFloat(getSTD[j]));
							var oTime = new Date(parseFloat(getOUTD[j]));
							var sH = sTime.getHours(); var sM = sTime.getMinutes();
							var oH = oTime.getHours(); var oM = oTime.getMinutes();
							if(sM<10) sM = "0"+sM;
							if(oM<10) oM = "0"+oM;
						if(getOUTD[j]>nowTime){
							if(getSTD[j]<=nowTime && getOUTD>=nowTime){
								$('#item'+i).addClass('red').removeClass('green').removeClass('orange');
								$('#item'+i+' .caption').text(getTEXT[j]);
								$('#item'+i+' .date').html('Занято до <b>'+oH+":"+oM+"</b>");
							}else if(((getSTD[j]-nowTime)/1000/60)<=60 && ((getSTD[j]-nowTime)/1000/60)>0){
								$('#item'+i).addClass('orange').removeClass('red').removeClass('green');
								$('#item'+i+' .caption').text(getTEXT[j]);
								if(((getSTD[j]-nowTime)/1000/60).toFixed(0)>0){var remain = ((getSTD[j]-nowTime)/1000/60).toFixed(0)+'-мин</b>, до <b>'}else{ var remain = ((getSTD[j]-nowTime)/1000).toFixed(0)+'-сек</b>, до <b>'}
								$('#item'+i+' .date').html('Будет занято через <b>'+remain+oH+":"+oM+"</b>");
							}else{
								$('#item'+i).addClass('green').removeClass('red').removeClass('orange');
								$('#item'+i+' .caption').text(getTEXT[j]);
								$('#item'+i+' .date').html('Свободно до <b>'+sH+":"+sM+"</b>");
							}
						}else{
							$('#item'+i).addClass('green').removeClass('red').removeClass('orange');
							$('#item'+i+' .caption').text('Можно бронировать');	
						}
					}
				}else{
					$('#item'+i+' .caption').text('Можно бронировать');
				}
			}
				
		},
		cards(select){
			switch(select){
				case 'green':
					$('.red, .orange').slideUp(400);
					$('.green').slideDown(400);
					$('li a').removeClass('active');
					$('li#green a').addClass('active');
					break;
				case 'red':
					$('.green, .orange').slideUp(400);
					$('.red').slideDown(400);
					$('li a').removeClass('active');
					$('li#red a').addClass('active');
					break;
				case 'orange':
					$('.red, .green').slideUp(400);
					$('.orange').slideDown(400);
					$('li a').removeClass('active');
					$('li#orange a').addClass('active');
					break;
				default:
					$('.red, .green, .orange').slideDown(400);
					$('li a').removeClass('active');
					$('li#all a').addClass('active');
			}
		}
	}
})