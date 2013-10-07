class OsUser < ActiveRecord::Base
  attr_accessible :name, :password, :tenant_id, :user_id

  belongs_to :user

end
