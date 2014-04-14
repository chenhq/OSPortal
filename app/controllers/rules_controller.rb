require 'openstack_activeresource'

class RulesController < ApplicationController
  before_filter :authenticate_user!
  before_filter :require_openstack_login

  def new
    @rule = OpenStack::Nova::Compute::Rule.new(:ip_protocol => "TCP",
                                               :from_port   => "22",
                                               :to_port     => "22",
                                               :cidr        => "0.0.0.0/0")
    respond_to do |format|
      # format.json { render json: @rule }
      format.json { render :partial => 'new.json.erb' }
    end
  end

  def create
    @security_group = OpenStack::Nova::Compute::SecurityGroup.find(params[:security_group_id]);
    if params[:port_option] == "single-port"
      from_port = to_port = params[:single_port].to_i
    else
      from_port = params[:from_port].to_i
      to_port = params[:to_port].to_i
    end

    @rule = OpenStack::Nova::Compute::Rule.new(:ip_protocol => params[:ip_protocol].downcase,
                                               :from_port   => from_port,
                                               :to_port     => to_port,
                                               :cidr        => params[:cidr]
                                               );
    @rule.parent_group = @security_group
    
    respond_to do |format|
      if @rule.save
        format.html { redirect_to '/securities/' + @security_group.id.to_s, notice: 'Rule was successfully created.' }
        format.json { render json: @security_group.rules, status: :created, location: @security_group }
      else
        format.html { render action: "new" }
        format.json { render json: @rule.errors, status: :unprocessable_entity }
      end
    end


  end

  def destory
  end
  
  def delete
    @security_group = OpenStack::Nova::Compute::SecurityGroup.find(params[:security_group_id])
    @security_group.rules.each do |rule|
      if params[:ids].include? rule.id.to_s 
        rule.destroy
      end
    end
   
    respond_to do |format|
      format.html { redirect_to '/securities/' + @security_group.id.to_s }
      format.json { head :no_content }
    end
  end

end
