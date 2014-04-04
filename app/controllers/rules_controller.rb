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
      format.json { render json: @rule }
    end
  end

  def create
  end

  def destory
  end
end
