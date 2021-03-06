# microservice-shop: 微服务秒杀系统，主要使用springCloud微服务,使用redis和rabbitMq完成秒杀服务,代码遵循restful api 接口规范
## 微服务架构描述如下:
* shop-common:存放公共实体类和工具类
* shop-eureka:服务注册中心
* shop-zuul:配置每个微服务的路由网关
* shop-web:存放前端静态资源
* shop-seckill:秒杀服务
* shop-system:系统模块
## 秒杀服务整合rabbitMq,包含五种消费模型实例:
* 生产者 : 用户(秒杀商品, 将用户id和秒杀商品id存入消息队列)
* 消费者 ：订单系统(从消息队列拿出用户和秒杀商品信息, 下订单)
### 五种消息模型:
* 基本消息模型：生产者–>队列–>消费者
* work消息模型：生产者–>队列–>多个消费者共同消费
* 订阅模型-Fanout：广播模式，将消息交给所有绑定到交换机的队列，每个消费者都会收到同一条消息
* 订阅模型-Direct：定向，把消息交给符合指定 rotingKey 的队列
* 订阅模型-Topic 主题模式：通配符，把消息交给符合routing pattern（路由模式） 的队列
## 微服务之间redis开启session共享
* 引入spring-session-data-redis启动器 并在启动类上加上@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)
## 解决@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)加上注解,开启微服务之间的session共享,redis报错问题
* 更改redis.conf配置 因为redis部署在docker上,
## springboot 整合docker redis rabbitMq 我部署在了docker,然后编写dockerFile创建镜像,部署在docker容器上

## 优化  项目初始化时，将所有的秒杀商品的库存存进redis
* 1 创建一个类，实现ApplicationListener接口，并重写里面的onApplicationEvent方法,在这个方法里面写逻辑即可
* 2 在启动类中注册我们刚刚创建的初始化类
