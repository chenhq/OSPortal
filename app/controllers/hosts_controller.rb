require 'openstack_activeresource'

class HostsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :require_openstack_login

  # layout 'application', :only => [:new]
  def index
    @servers = OpenStack::Nova::Compute::Server.all
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: server_to_json(@servers)
      }
    end
  end

  def new
    @operating_systems = OperatingSystem.all
    @images = OpenStack::Nova::Compute::Image.all
    @images.select! { |image| image.metadata.user_id? }
    @server = OpenStack::Nova::Compute::Server.new
    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @server }
    end
  end

  def create
    flavorid = InstanceType.where(vcpus: params[:cpu], memory_mb: params[:memory]).first
    flavor = OpenStack::Nova::Compute::Flavor.find("d38a9a7c-4f88-4c74-bdce-a386fe37e2ee")
    image = OpenStack::Nova::Compute::Image.find(params[:"image-radio"])
    @servers = [];
    1.upto(params[:hostnum].to_i) do |i| 
      server = OpenStack::Nova::Compute::Server.create(:name => params[:hostname], :image => image, 
                                              :flavor => flavor, :adminPass => params[:password],
                                              :"OS-DCF:diskConfig" => "AUTO")
      @servers << server
    end


    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: server_to_json(@servers) }
    end
    
    # respond_to do |format|
    #   if @server.save
    #     format.html { redirect_to @server, notice: 'server was successfully created.' }
    #     format.json { render json: @server, status: :created }
    #   else
    #     format.html { render action: "new" }
    #     format.json { render json: @server.errors, status: :unprocessable_entity }
    #   end
    # end

    # TODO
    # change admin passwd
    # @newserver.change_password!(params[:password])

  end

  def show
    # @compute = compute
    if params[:id] != 'show'
      @servers = OpenStack::Nova::Compute::Server.find(params[:id])
    else
      @servers = params[:instanceids].map do |id|
        begin
          OpenStack::Nova::Compute::Server.find(id)
        rescue ActiveResource::ResourceNotFound
          deletedServer = OpenStack::Nova::Compute::Server.new
          deletedServer.id = id
          deletedServer.status = 'deleted';
          deletedServer
        end
      end
    end
    # @compute.get_server(params[:id])
    # @flavor = @compute.get_flavor(@server.flavor["id"])
    # @image = @compute.get_image(@server.image["id"])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: server_to_json(@servers) }
    end

  end

  def start
    params[:instanceids].each do |serverid| 
      begin
        @server = OpenStack::Nova::Compute::Server.find(serverid)
        @server.start
      rescue ActiveResource::ResourceNotFound, ActiveResource::BadRequest
      end
    end
    respond_to do |format|
      format.json { render json: server_to_json(@server) }
    end

  end
  
  def shutdown
    params[:instanceids].each do |serverid| 
      begin
        @server = OpenStack::Nova::Compute::Server.find(serverid)
        @server.stop
      rescue ActiveResource::ResourceNotFound, ActiveResource::BadRequest
      end  
    end
    operation_response
     
  end

  def poweroff
    params[:instanceids].each do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.stop
    end
    operation_response
  end

  def reboot(type=:soft)
    params[:instanceids].each do |serverid| 
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
    @vnc_consoles = params[:instanceids].map do |serverid| 
      @server = OpenStack::Nova::Compute::Server.find(serverid)
      @server.vnc_console
    end
    respond_to do |format|
      format.json { render json: @vnc_consoles }
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
    begin
      params[:instanceids].each do |inst| 
        @server = OpenStack::Nova::Compute::Server.find(inst).destroy
      end
    rescue ActiveResource::ResourceNotFound
    end
    operation_response
  end

  def operation_response
    respond_to do |format|
      format.json { render json: { status: 0 } }
    end
  end


  def server_to_json(server)
    options = { 
      :except => [ :tenant_id], #,
                   # :user_data],
      :include => { 
        :image => {:only => [:id, :name] },
        :flavor => {:only => [:id, :name, :vcpus, :ram, :disk] }
      }
    }
    
    return server.to_json(options);
  end
    

end
