require 'database_pool'

class OsType < Glance
  attr_accessible :desc, :family, :name
  has_many :operating_systems
end
