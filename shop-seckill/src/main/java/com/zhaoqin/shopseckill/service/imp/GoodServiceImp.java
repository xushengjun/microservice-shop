package com.zhaoqin.shopseckill.service.imp;

import com.zhaoqin.shopcommon.entity.Goods;
import com.zhaoqin.shopseckill.mapper.GoodMapper;
import com.zhaoqin.shopseckill.service.GoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName GoodServiceImp
 * @Author zhaoqin
 * @Date 2020/3/4
 */
@Service
public class GoodServiceImp implements GoodService {
    @Autowired
    private GoodMapper mapper;

    @Override
    public List<Goods> getGoodList() {
        return mapper.getGoodList();
    }
}
