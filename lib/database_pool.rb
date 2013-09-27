
require 'active_record'

class Portal < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "osportal",
                       :username => "osportal",
                       :password => "osportal1234",
                       :host => "122.227.254.55",
                       :port => 3306)
end

class Nova < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "nova",
                       :username => "nova",
                       :password => "fd7b83053efe47bc",
                       :host => "122.227.254.55",
                       :port => 3306)

end

class Glance < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "glance",
                       :username => "glance",
                       :password => "b54b09ab0d504173",
                       :host => "122.227.254.55",
                       :port => 3306)

end

class Cinder < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "cinder",
                       :username => "cinder",
                       :password => "fd17f70c198242c8",
                       :host => "122.227.254.55",
                       :port => 3306)

end

class Keystone < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:adapter => "mysql2",
                       :database => "keystone",
                       :username => "keystone",
                       :password => "82cce0f524574c70",
                       :host => "122.227.254.55",
                       :port => 3306)

end




# class Portal < ActiveRecord::Base
#   establish_connection "portal_development"
#   self.abstract_class = true
# end


# class Glance < ActiveRecord::Base
#   establish_connection "glance_development"
#   self.abstract_class = true
# end

# class Cinder < ActiveRecord::Base
#   establish_connection "cinder_development"
#   self.abstract_class = true
# end

# class Keystone < ActiveRecord::Base
#   establish_connection "keystone_development"
#   self.abstract_class = true
# end

# class Nova < ActiveRecord::Base
#   establish_connection "nova_development"
#   self.abstract_class = true
# end
