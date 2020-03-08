package com.zhaoqin.shopcommon.config;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.*;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @ClassName RedisConfig
 * @Author zhaoqin
 * @Date 2020/1/15 16:24
 */
@Configuration
public class RedisConfig {

    @Bean("myValueOperations")
    public ValueOperations getValueOperations(@Qualifier(value="redisTemplate") RedisTemplate redisTemplate){
        return redisTemplate.opsForValue();
    }
    @Bean
    public HashOperations getHashOperations(@Qualifier(value="redisTemplate") RedisTemplate redisTemplate){
        return redisTemplate.opsForHash();
    }
    @Bean
    public ListOperations getListOperations(@Qualifier(value="redisTemplate") RedisTemplate redisTemplate){
        return redisTemplate.opsForList();
    }
    @Bean
    public SetOperations getSetOperations(@Qualifier(value="redisTemplate") RedisTemplate redisTemplate){
        return redisTemplate.opsForSet();
    }
    @Bean
    public ZSetOperations getZSetOperations(@Qualifier(value="redisTemplate") RedisTemplate redisTemplate){
        return redisTemplate.opsForZSet();
    }

    /**
     * RedisTemplate配置
     */
    @Bean("redisTemplate")
    @Primary
    public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory lettuceConnectionFactory) {

        // 设置序列化
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<Object>(
                Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.activateDefaultTyping(om.getPolymorphicTypeValidator(),ObjectMapper.DefaultTyping.NON_FINAL,JsonTypeInfo.As.WRAPPER_ARRAY);
        om.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        jackson2JsonRedisSerializer.setObjectMapper(om);
        // 配置redisTemplate
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
        redisTemplate.setConnectionFactory(lettuceConnectionFactory);
        RedisSerializer<?> stringSerializer = new StringRedisSerializer();
        redisTemplate.setKeySerializer(stringSerializer);// key序列化
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);// value序列化
        redisTemplate.setHashKeySerializer(stringSerializer);// Hash key序列化
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);// Hash value序列化
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

}
