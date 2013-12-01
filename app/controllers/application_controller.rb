# -*- coding: utf-8 -*-
class ApplicationController < ActionController::Base
  
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

  private
  
  def require_openstack_login
    if OpenStack::Base.token.nil?   #TODO or OpenStack::Base.token.expired? 
      
      OpenStack::Keystone::Public::Base.site = Figaro.env.keystone_public_site
      
      auth = OpenStack::Keystone::Public::Auth.create :username => current_user.os_user.name , :password => current_user.os_user.password , :tenant_id => Figaro.env.keystone_public_tenantid

      OpenStack::Base.token = auth.token

      OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
      OpenStack::Nova::Volume::Base.site = auth.endpoint_for('volume').publicURL
    end
  end

  # admin login
  def require_openstack_admin_login
    if OpenStack::Base.token.nil? or OpenStack::Base.token.expired?
      OpenStack::Keystone::Public::Base.site = "http://192.168.122.247:5000/v2.0/"

      # Admin API, if needed
      OpenStack::Keystone::Admin::Base.site = "http://192.168.122.247:5000/v2.0/"   
      
      auth = OpenStack::Keystone::Public::Auth.create :username => Figaro.env.keystone_admin_username , :password => Figaro.env.keystone_admin_password , :tenant_id => Figaro.env.keystone_admin_tenantid
      OpenStack::Base.token = auth.token

      OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
      OpenStack::Nova::Volume::Base.site = auth.endpoint_for('volume').publicURL
    end
  end


end
