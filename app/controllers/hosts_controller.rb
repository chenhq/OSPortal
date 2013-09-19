class HostsController < ApplicationController
  def new
  end

  def show
    @os = OpenStack::Connection.create({:username => "admin", :api_key=>"175245a126f74b02", :auth_method=>"password", :auth_url => "http://122.227.254.55:5000/v2.0", :authtenant_name =>"admin", :service_type=>"compute"})
  end
end
