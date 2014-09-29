# -*- coding: utf-8 -*-
class SiteSkelController < ApplicationController
  @@title_prefix = '胜世云平台'

  def home
    @title = @@title_prefix + ' 首页'
  end

  def product
    @title = @@title_prefix + ' 产品介绍'
  end

  def about
    @title = @@title_prefix + ' 关于我们'
  end

  def contact
    @title = @@title_prefix + ' 联系我们'
  end
end
