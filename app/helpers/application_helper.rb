# -*- coding: utf-8 -*-
module ApplicationHelper

  def full_title(page_title)
    base_title = '胜世云计算'
    if page_title
      "#{base_title} #{page_title}"
    else
      base_title
    end

  end

end
