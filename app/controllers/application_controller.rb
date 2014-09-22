# -*- coding: utf-8 -*-

# -*- coding: utf-8 -*-
class ApplicationController < ActionController::Base
  after_filter :flash_to_headers  
  # before_filter :authenticate_user!
  # before_filter :require_openstack_login

  protect_from_forgery

  # 定义登录后的页面

  def after_sign_in_path_for(resource)
    hosts_path
  end

  def after_sign_out_path_for(resource)
    root_path
  end

  def flash_to_headers
    return unless request.xhr?
    response.headers['X-Message'] = flash_message
    response.headers["X-Message-Type"] = flash_type.to_s
    
    flash.discard # don't want the flash to appear when you reload page
  end


  private
  
  def require_openstack_login
    if OpenStack::Base.token.nil?   #TODO or OpenStack::Base.token.expired? 
      
      OpenStack::Keystone::Public::Base.site = Figaro.env.keystone_public_site
      
      auth = OpenStack::Keystone::Public::Auth.create :username => current_user.os_user.name , :password => current_user.os_user.password , :tenant_id => current_user.os_user.tenant_id

      OpenStack::Base.token = auth.token

      OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
      OpenStack::Nova::Volume::Base.site = auth.endpoint_for('volume').publicURL
    end
  end

  # admin login
  def require_openstack_admin_login
    if OpenStack::Base.token.nil? or OpenStack::Base.token.expired?
      OpenStack::Keystone::Public::Base.site = Figaro.env.keystone_public_site

      # Admin API, if needed
      OpenStack::Keystone::Admin::Base.site = Figaro.env.keystone_admin_site  
      
      auth = OpenStack::Keystone::Public::Auth.create :username => Figaro.env.keystone_admin_username , :password => Figaro.env.keystone_admin_password , :tenant_id => Figaro.env.keystone_admin_tenantid
      OpenStack::Base.token = auth.token

      OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
      OpenStack::Nova::Volume::Base.site = auth.endpoint_for('volume').publicURL
    end
  end

  def flash_message
    [:error, :warning, :notice].each do |type|
      return flash[type] unless flash[type].blank?
    end
  end

  def flash_type
    [:error, :warning, :notice].each do |type|
      return type unless flash[type].blank?
    end
  end

end
