require 'openstack_activeresource'

class HostsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :require_openstack_login

  layout 'application', :only => [:new]

  def index
    @servers = OpenStack::Nova::Compute::Server.all
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @server }
    end
  end

  def new
    @ostypes = OsType.all
    
    @distinct_cpu_flavors = InstanceType.select(:vcpus).uniq.order(:vcpus)
    @distinct_mem_flavors = InstanceType.select(:memory_mb).uniq.order(:memory_mb)
    
    @images = OpenStack::Nova::Compute::Image.all
    @images.select! { |image| image.metadata.user_id? }

    @server = OpenStack::Nova::Compute::Server.new
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @server }
    end
  end

  def create
    flavorid = InstanceType.where(vcpus: params[:cpu], memory_mb: params[:mem]).first
    flavor = OpenStack::Nova::Compute::Flavor.find(2)
    image = OpenStack::Nova::Compute::Image.find(params[:imageid])
    @server = OpenStack::Nova::Compute::Server.new(:name => params[:hostname], :image => image, 
                                                   :flavor => flavor, :adminPass => params[:password],
                                                   :"OS-DCF:diskConfig" => "AUTO")

    respond_to do |format|
      if @server.save
        format.html { redirect_to @server, notice: 'server was successfully created.' }
        format.json { render json: @server, status: :created }
      else
        format.html { render action: "new" }
        format.json { render json: @server.errors, status: :unprocessable_entity }
      end
    end

    # TODO
    # change admin passwd
    # @newserver.change_password!(params[:password])

  end

  def show
    # @compute = compute
    # @server = @compute.get_server(params[:id])
    # @flavor = @compute.get_flavor(@server.flavor["id"])
    # @image = @compute.get_image(@server.image["id"])
  end

  def start
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.start
    end
    operation_response
  end
  
  def shutdown
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.stop
    end
    operation_response
     
  end

  def poweroff
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.stop
    end
    operation_response
  end

  def reboot(type=:soft)
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.reboot(type)
    end
    operation_response
  end
  
  def softreboot
    reboot(:soft)
  end

  def hardreboot
    reboot(:hard)
  end

  def emergency_login
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @vnc_console = @server.vnc_console
    end
    respond_to do |format|
      format.json { render json: { vnc_console: @vnc_console } }
    end
  end

  def create_image
    @server = OpenStack::Nova::Compute::Server.find(params[:"server_id"])
    @server.create_new_image(params[:"image_name"])
    
    # {"image_create_host"=>"wertyuio", "image_name"=>"dddddd", "image_desc"=>"ddd", "img-create-instance-id"=>"f7da34c1-025c-48e8-b42d-63fdb14c63b8"}
    redirect_to images_path
    
  end

  def upgrade
 
  end

  def reinstall
  end
  
  def delete
    params[:serverids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid).destroy
    end
    operation_response
  end

  def operation_response
    respond_to do |format|
      format.json { render json: { status: 0 } }
    end
  end

end
