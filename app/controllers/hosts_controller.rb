class HostsController < ApplicationController
  def compute
    @compute = OpenStack::Connection.create({:username => "admin", 
                                              :api_key=>"175245a126f74b02", 
                                              :auth_method=>"password",
                                              :auth_url => "http://122.227.254.55:5000/v2.0", 
                                              :authtenant_name =>"admin", 
                                              :service_type=>"compute"})
  end

  
  def new
    @conpute = compute
    
  end

  def index
    @compute = compute    
    @servers = Hash.new { |h, k| h[k] = { } }

    @compute.list_servers_detail.each do | item |
      @servers[item[:name]][:status] = item[:status]
      @servers[item[:name]][:addresses] = item[:addresses]
      @servers[item[:name]][:"OS-EXT-SRV-ATTR:host"] = item[:"OS-EXT-SRV-ATTR:host"]
      @servers[item[:name]][:image] = item[:image]
      @servers[item[:name]][:flavor] = item[:flavor]
      @servers[item[:name]][:created] = item[:created]
    end
    
    @compute.list_servers.each do |item|
      @servers[item[:name]][:id] = item[:id]
    end

  end


  def show
    @compute = compute
    @server = @compute.get_server(params[:id])
    @flavor = @compute.get_flavor(@server.flavor["id"])
    @image = @compute.get_image(@server.image["id"])
  end
end
