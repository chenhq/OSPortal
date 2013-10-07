# -*- coding: utf-8 -*-
class ApplicationController < ActionController::Base
  
  # before_filter :authenticate_user!
  # before_filter :require_openstack_login

  protect_from_forgery

  # 定义登录后的页面
  def after_sign_in_path_for(resource)
    hosts_path
    # stored_location_for(resource) ||
    #   if resource.is_a?(User) && resource.can_publish?
    #     publisher_url
    #   else
    #     super
    #   end
  end

  private
  
  def require_openstack_login
    if OpenStack::Base.token.nil?
      OpenStack::Keystone::Public::Base.site = "http://60.55.40.228:5000/v2.0/"
      # Admin API, if needed
      # OpenStack::Keystone::Admin::Base.site = <keystone_admin_api_uri>
      
      auth = OpenStack::Keystone::Public::Auth.create :username => current_user.os_user.name , :password => current_user.os_user.password , :tenant_id => current_user.os_user.tenant_id
      OpenStack::Base.token = auth.token

      OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
      OpenStack::Nova::Volume::Base.site = auth.endpoint_for('volume').publicURL
      # Set other endpoints if needed ...
      # For instance:
    end
  end

  # # TODO
  # def require_openstack_admin_login
  #   if OpenStack::Base.token.nil? or OpenStack::Base.token.expired?
  #     OpenStack::Keystone::Public::Base.site = "http://60.55.40.228:5000/v2.0/"
  #     # Admin API, if needed
  #     # "http://10.10.10.51:35357/v2.0"
  #     OpenStack::Keystone::Admin::Base.site = "http://60.55.40.228:5000/v2.0/"   

      
  #     auth = OpenStack::Keystone::Public::Auth.create :username => "admin" , :password => "adminP@ssw0rd" , :tenant_id => "2d160a9adf58470fa5626b454a0b2075"
  #     OpenStack::Base.token = auth.token

  #     OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
  #     OpenStack::Nova::Volume::Base.site = auth.endpoint_for('volume').publicURL
  #     # Set other endpoints if needed ...
  #     # For instance:
  #   end
  # end


end
