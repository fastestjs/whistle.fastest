let str = '<script type="text/javascript" src="//fastest2.now.qq.com/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152" integrity="sha256-4HCvnM9yevyLsSI1LV4kuQsOEDkEX7+A13v8ll1yBFg= sha384-uHbkdqrH3SgKZDm8WRtFMC2YTKOgaVC5pUAs9oOLQxPCjTcuzIB25WulgXQpdCN0" crossorigin="anonymous"></script>'

console.log(str.replace(/\s+integrity="[^"]*"/gi, ''));