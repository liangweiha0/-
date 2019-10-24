// pages/detail/detail.js
let datas = require('/../../datas/list-data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailObj:{},
    index:null,
       isCollected:false,
    isMusicPlay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
   //获取参数值
   let index  = options.index; 
   //更新data中detaObj的状态值
   this.setData({
     detailObj:datas.list_data[index],
     index
   });

    //根据本地缓存的数据判断用户是否收藏当前的文章
    let detailStorage = wx.getStorageSync('isCollected');

    if(!detailStorage){
      //在缓存中初始化空对象
      wx.setStorageSync('isCollected', {})
    }
  
    //判断用户是否收藏
     if(detailStorage[index]){
       this.setData({
         isCollected:true
       })
     }

     //监听音乐播放
     wx.onBackgroundAudioPlay(()=>{
         this.setData({
           isMusicPlay:true
         })
     });
     //监听音乐暂停 
     wx.onBackgroundAudioPause(()=>{
             this.setData({
           isMusicPlay:false 
         })
     });
  }, 
  

  handleCollection(){
    let isCollected = !this.data.isCollected;
    //更新状态
    this.setData({
      isCollected
    });

  let title = isCollected?'收藏成功':'取消收藏';
    wx.showToast({
      title,
      icon:'success'
    })


    let {index} = this.data;
    //let obj = {};
    wx.getStorage({
      key: 'isCollected',
      success: (datas)=> {
        let obj = datas.data;
        obj[index] = isCollected;
        wx.setStorage({
          key: 'isCollected',
          data: obj,
          success: () => {

          }
        })
      },
    })
   
   

   
  },
  handleMusicPlay(){
         let isMusicPlay=!this.data.isMusicPlay;
         this.setData({
           isMusicPlay
         });
         //控制音乐播放
         if(isMusicPlay){
           //播放
           let{dataUrl,title}=this.data.detailObj.music;
           wx.playBackgroundAudio({
             dataUrl,
             title
           })
         }else{
           wx.pauseBackgroundAudio()
         }
         
         },

         handleShare(){
           wx.showActionSheet({
             itemList: [
               '分享到朋友圈','分享给微信朋友','分享到微博'
             ],
           })
         }
  
  })
 
    
  