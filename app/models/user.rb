require 'openstack_activeresource'
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, 
  # :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable,
         :lockable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  # attr_accessible :title, :body

  has_one :os_user

  after_create :create_os_account

  def create_os_account
    
    # Set Keystone Public and Admin API endpoints
    OpenStack::Keystone::Public::Base.site = Figaro.env.keystone_public_site
    OpenStack::Keystone::Admin::Base.site = Figaro.env.keystone_admin_site

    # Authentication
    auth = OpenStack::Keystone::Public::Auth.create :username => Figaro.env.keystone_admin_username, :password => Figaro.env.keystone_admin_password, :tenant_id => Figaro.env.keystone_admin_tenantid

    # Set the auth token for next API requests
    OpenStack::Base.token = auth.token

    # Create a new tenant
    tenant_name = "project#{self.id}"
    tenant_desc = "project of user #{self.email}"
    new_tenant = OpenStack::Keystone::Admin::Tenant.create :enabled => true, :name => tenant_name, :description => tenant_desc 
    
    # Create a new user in new_tenant
    username = "user#{self.id}"
    password = "password#{self.id}"
    new_user = OpenStack::Keystone::Admin::User.create :tenant => new_tenant, :name => username, :password => password, :email => self.email, :enabled => true

    # Assign the "memberRole" in new_tenant to new_user
    member_role = OpenStack::Keystone::Admin::Role.find_by_name "Member"
    new_tenant.add_role_to_user member_role, new_user
    
    OsUser.create(name: username, password: password, tenant_id: new_tenant.id, user_id: id);
  end


end
