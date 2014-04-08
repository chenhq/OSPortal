require 'openstack_activeresource'

class SecuritiesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :require_openstack_login

  # layout 'hosts'
  def index
    @securities = OpenStack::Nova::Compute::SecurityGroup.all
    
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @securities }
    end
  end

  # GET /securities/1
  # GET /securities/1.json
  def show
    @security = OpenStack::Nova::Compute::SecurityGroup.find(params[:id])

    if params[:content]= 'only-rules'
      @rules = @security.rules
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @rules }
      end
    else 
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @security }
      end
    end
end

  # GET /securities/new
  # GET /securities/new.json
  def new
    @security = OpenStack::Nova::Compute::SecurityGroup.new
    @rule = OpenStack::Nova::Compute::Rule.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @security }
    end
  end

  # not support by API
  # GET /securities/1/edit
  def edit
    @security = OpenStack::Nova::Compute::SecurityGroup.find('19')
    @rules = @security.rules
  end

  # POST /securities
  # POST /securities.json
  def create
    @security = OpenStack::Nova::Compute::SecurityGroup.new(params);

    # # TODO
    # params[:rules].each do |k, v|
    #   @rule = OpenStack::Nova::Compute::Rule.new
    #   @rule.ip_protocol = v[:ip_protocol]
    #   @rule.from_port = v[:from_port]
    #   @rule.to_port = v[:to_port]
    #   @rule.cidr = v[:cidr]
    #   @rule.parent_group = @security
    #   @security.rule = @rule
    #   @rule.save
    #   @security.rule = @rule
    # end

    respond_to do |format|
      if @security.save 
        format.html { redirect_to securities_path, notice: "Security Group successfully create. "}
        format.json { render json: @security, status: :created, location: @security}
      else 
        format.haml { render action: :new}
        format.json { render json: @security.errors, stauts: :unprocessable_entity }
      end
    end

    # respond_to do |format|
    #   if @security.save
    #     format.html { redirect_to @security, notice: 'Security was successfully created.' }
    #     format.json { render json: @security, status: :created, location: @security }
    #   else
    #     format.html { render action: "new" }
    #     format.json { render json: @security.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # PUT /securities/1
  # PUT /securities/1.json
  def update
    @sg = OpenStack::Nova::Compute::SecurityGroup.find(params[:id])
    
    
    respond_to do |format|
      if @sg.update_attributes(params[:security_group])
        format.html { redirect_to '/securities/', notice: 'Security was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @sg.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /securities/1
  # DELETE /securities/1.json
  def destroy
    @security = Security.find(params[:id])
    @security.destroy

    respond_to do |format|
      format.html { redirect_to securities_url }
      format.json { head :no_content }
    end
  end

  def delete
    params[:ids].each do |id|
      OpenStack::Nova::Compute::SecurityGroup.find(id).destroy
    end
    respond_to do |format|
      format.html { redirect_to securities_url }
      format.json { head :no_content }
    end
  end

  def security_to_json(security)
    options = {
      :include => :rules }
    return security.to_json(options)
  end
end
