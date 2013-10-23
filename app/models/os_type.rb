class OsType <  ActiveRecord::Base
  attr_accessible :desc, :family, :name, :username
  has_many :operating_systems
end
